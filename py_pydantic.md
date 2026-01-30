# Preface

When handling data from external systems, such as APIs, end-user input, or other sources, we must always remember a fundamental principle in development: **"Never trust user input."**

Therefore, we must strictly check and validate this data to ensure it is appropriately formatted and standardized. The purpose is to ensure that the data conforms to the input specifications required by our program, thereby guaranteeing the project runs correctly and efficiently.

## Why Use Python's Pydantic Library?

Pydantic is a third-party library for data validation and parsing in Python, and it is now the most widely used data validation library in Python.

*   It leverages a declarative way to define data models and the powerful features of Python type hints to perform data validation and serialization, making your code more reliable, readable, concise, and easier to debug.
*   It can also generate JSON schemas from models, providing features like automatic documentation generation, making it easy to integrate with other tools.

Pydantic is widely used in many excellent projects.

### Some Main Features of Pydantic

**Ease of Use**

Pydantic is simple and intuitive to use, requiring minimal boilerplate code and configuration. It works well with many popular IDEs and static analysis tools such as PyCharm, VS Code, mypy, etc. Pydantic easily integrates with other popular Python libraries (like Flask, Django, FastAPI, and SQLAlchemy), making it easy to use in existing projects.

**Type Annotations**

Pydantic uses type annotations to define the field types of models, ensuring data conforms to the expected types and formats. You can use Python built-in types, custom types, or other validation types provided by Pydantic.

**Data Validation and User-Friendly Errors**

Pydantic automatically performs data validation based on the model definition. It checks field types, lengths, ranges, etc., and automatically reports validation errors. Pydantic provides informative and readable error messages, including the location, type, and input of the error. You can use the `ValidationError` exception to catch validation errors.

**Serialization and Deserialization**

Pydantic provides conversion functions from various data formats (e.g., JSON, dictionaries) to model instances. It can automatically parse input data into model instances while preserving type safety and validation rules.

**High Performance**

The core validation logic of Pydantic is written in Rust, making it one of the fastest data validation libraries in Python. It also supports lazy validation and caching to improve efficiency.

Pydantic is very similar to Python's built-in `dataclasses`. The main difference is that Pydantic has more powerful data validation and serialization capabilities.

## Installation

Installing Pydantic is very simple:

```bash
pip install pydantic[email]  # Will use email validation, installed together here
```

## How to Use Pydantic?

The main way to use Pydantic is to create custom classes that inherit from `BaseModel`, the base class for all Pydantic models. Then, you can define the model's attributes using type annotations and optionally provide default values or validators.

### The Core of Pydantic is the Model

For example, let's create a simple model for a user, using Python's type annotations to declare the expected data types:

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ValidationError, EmailStr
# Import the model base class corresponding to pydantic
from pydantic import constr, conint

class GenderEnum(str, Enum):
    """
    Gender Enum
    """
    male = "男"
    female = "女"

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: conint(ge=0, le=99)  # Integer range: 0 <= age <= 99
    email: EmailStr
    signup_ts: Optional[datetime] = None
    friends: List[str] = []
    password: constr(min_length=6, max_length=10)  # Character length
    phone: constr(pattern=r'^1\d{10}$')  # Regex validation for phone number
    sex: GenderEnum  # Enum validation, can pass: 男 and 女
```

We defined a class named `User` that inherits from `BaseModel`.

*   The `id` attribute is an integer and is required, representing the user ID.
*   The `name` attribute is a string type with a default value of `'小卤蛋'`.
*   The `age` attribute is an integer and is required, representing the user's age.
*   The `email` attribute is of email address type.
*   The `signup_ts` attribute is an optional datetime type, defaulting to `None`, representing the user's registration time.
*   The `friends` attribute is a list of strings type, defaulting to an empty list, representing the user's friend list.
*   The `sex` attribute is an enumeration type with optional values of "男" or "女", representing the user's gender.

### Validating Data

Once you have defined a model, you can use it to validate data.

If you want to instantiate a `User` object from a dictionary, you can use dictionary unpacking or the `.model_validate()`, `.model_validate_json()` class methods:

```python
if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
        'password': '123456',
        'phone': '13800000000',
        'sex': '男'
    }
    try:
        # user = User(**user_data)
        user = User.model_validate(user_data)
        print(f"User id: {user.id}, User name: {user.name}, User email: {user.email}")
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

When all data conforms to the model definition, you can access the model's attributes as usual:
```
User id: 123, User name: 小卤蛋, User email: xiaoludan@example.com
```

If the data does not conform to the model definition (deliberately not passing the `id` field below), Pydantic will throw a `ValidationError`.

```python
if __name__ == '__main__':
    user_data = {
        # "id": 123,
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
        'password': '123456',
        'phone': '13800000000',
        'sex': '男'
    }
    try:
        # user = User(**user_data)
        user = User.model_validate(user_data)
        print(f"User id: {user.id}, User name: {user.name}, User email: {user.email}")
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

Error:
```
Validation error: [{"type":"missing","loc":["id"],"msg":"Field required","input":{"name":"小卤蛋","age":20,"email":"xiaoludan@example.com","signup_ts":"2024-07-19 00:22","friends":["公众号：海哥python","小天才",""],"password":"123456","phone":"13800000000","sex":"男"},"url":"https://errors.pydantic.dev/2.8/v/missing"}]
```

### Custom Validation

In addition to built-in validators, you can define custom validators for models. Assuming you want to ensure the user's age is over 18, you can create a custom validator using the `@field_validator` decorator:

```python
# ! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator, ValidationError

def check_name(v: str) -> str:
    """Validator to be used throughout"""
    if not v.startswith("小"):
        raise ValueError("must be startswith 小")
    return v

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: int
    email: EmailStr
    signup_ts: Optional[datetime] = None
    friends: List[str] = []
    validate_fields = field_validator("name")(check_name)

    @field_validator("age")
    @classmethod
    def check_age(cls, age):
        if age < 18:
            raise ValueError("用户年龄必须大于18岁")
        return age
```

When trying to create a user for a child who is only 12 years old:

```python
if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小卤蛋",
        "age": 12,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
    }
    try:
        user = User(**user_data)
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

You will get an error:
```
Validation error: [{"type":"value_error","loc":["age"],"msg":"Value error, 用户年龄必须大于18岁","input":12,"ctx":{"error":"用户年龄必须大于18岁"},"url":"https://errors.pydantic.dev/2.8/v/value_error"}]
```

Or, if the `name` does not start with "小":

```python
if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "大卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
    }
    try:
        user = User(**user_data)
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

You will get an error:
```
Validation error: [{"type":"value_error","loc":["name"],"msg":"Value error, must be startswith 小","input":"大卤蛋","ctx":{"error":"must be startswith 小"},"url":"https://errors.pydantic.dev/2.8/v/value_error"}]
```

If you want to dynamically validate multiple fields simultaneously, you can also use the `model_validator` decorator.

```python
# ! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from datetime import datetime
from typing import List, Optional
from typing_extensions import Self  # If Python version is not lower than 3.11, Self can be imported directly from typing
from pydantic import BaseModel, ValidationError, EmailStr, field_validator, model_validator

def check_name(v: str) -> str:
    """Validator to be used throughout"""
    if not v.startswith("小"):
        raise ValueError("must be startswith 小")
    return v

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: int
    email: EmailStr
    signup_ts: Optional[datetime] = None
    friends: List[str] = []
    validate_fields = field_validator("name")(check_name)

    @field_validator("age")
    @classmethod
    def check_age(cls, age):
        if age < 18:
            raise ValueError("用户年龄必须大于18岁")
        return age

    @model_validator(mode="after")
    def check_age_and_name(self) -> Self:
        if self.age < 30 and self.name != "小卤蛋":
            raise ValueError("用户年龄必须小于30岁, 且名字必须为小卤蛋")
        return self

if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
    }
    try:
        user = User(**user_data)
        print(user.model_dump())
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

Execution result:
```
Validation error: [{"type":"value_error","loc":[],"msg":"Value error, 用户年龄必须小于30岁, 且名字必须为小卤蛋","input":{"id":123,"name":"小小卤蛋","age":20,"email":"xiaoludan@example.com","signup_ts":"2024-07-19 00:22","friends":["公众号：海哥python","小天才",""]},"ctx":{"error":"用户年龄必须小于30岁, 且名字必须为小卤蛋"},"url":"https://errors.pydantic.dev/2.8/v/value_error"}]
```

`validate_call` is also, in my opinion, a very useful decorator.

```python
from typing import Annotated
from pydantic import BaseModel, Field, validate_call

class Person(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=20)

# @validate_call
def greet(person: Person, message: Annotated[str, Field(min_length=1, max_length=100)]):
    print(f"Hello, {person.name}! {message}")

# Correct call
greet(Person(name="公众号：海哥python", age=18), "How are you?")
greet(Person(name="公众号：海哥python", age=18), 1)
```

Without using `validate_call`, although PyCharm may prompt that the type of `1` does not match, it will not actually cause an error during execution.

However, we typically want definitions and usage to meet our expectations to avoid unforeseen errors. The `validate_call` decorator can well meet this requirement for us.

```python
from typing import Annotated
from pydantic import BaseModel, Field, validate_call

class Person(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=20)

@validate_call
def greet(person: Person, message: Annotated[str, Field(min_length=1, max_length=100)]):
    print(f"Hello, {person.name}! {message}")

# Incorrect call, will raise a validation error
try:
    greet(Person(name="公众号：海哥python", age=18), 1)
except Exception as e:
    print(e)
```

At this point, execution will report an error:
```
1 validation error for greet
1
  Input should be a valid string [type=string_type, input_value=1, input_type=int]
    For further information visit https://errors.pydantic.dev/2.5/v/string_type
```

### Computed Fields

Fields may be derived from other fields. For example, age is generally dynamically calculated based on birthday and current date, area is dynamically calculated through length and width, etc.

Here we take dynamically adding a `link` field as an example:

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ValidationError, EmailStr, computed_field

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: int
    email: EmailStr
    signup_ts: Optional[datetime] = None
    friends: List[str] = []

    @computed_field  # Computed field
    @property
    def link(self) -> str:
        return f"尼古拉斯 · {self.name}"

if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
    }
    #
    try:
        user = User(**user_data)
        print(f"{user.model_dump()} .... type: {type(user.model_dump())}")
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

The output result is (after serialization, you will find an additional `link` field):
```
{'id': 123, 'name': '小卤蛋', 'age': 20, 'email': 'xiaoludan@example.com', 'signup_ts': datetime.datetime(2024, 7, 19, 0, 22), 'friends': ['公众号：海哥python', '小天才', ''], 'link': '尼古拉斯 · 小卤蛋'} .... type: <class 'dict'>
```

### Configuration Management

```bash
pip install pydantic_settings
```

Using Pydantic's `BaseSettings` makes it very convenient to manage application configuration.

```python
# ! -*-conding: UTF-8 -*-
# @公众号: 海哥python
import os
# Import HttpUrl and Field classes from the pydantic module to set and validate the types and constraints of configuration data.
from pydantic import HttpUrl, Field
# Import the BaseSettings class from the pydantic_settings module as the base class for the configuration class.
from pydantic_settings import BaseSettings

# Initialize environment variables, which will be used to configure the application's database and API access.
os.environ['DATABASE_HOST'] = "http://baidu.com"
os.environ['DATABASE_USER'] = "公众号：海哥python"
os.environ['DATABASE_PASSWORD'] = "123456abcd"
os.environ['API_KEY'] = "DHKSDsdh*(sdds"

class AppConfig(BaseSettings):
    """
    Application configuration class, inherits from BaseSettings, used to manage application configuration information.
    Attributes:
        database_host: URL of the database host, must be a valid HTTP or HTTPS URL.
        database_user: Name of the database user, minimum length is 5 characters.
        database_password: Password of the database user, minimum length is 10 characters.
        api_key: API access key, minimum length is 8 characters.
    """
    # Define configuration item database_host, type is HttpUrl, ensuring it is a valid HTTP or HTTPS URL.
    database_host: HttpUrl
    # Define configuration item database_user, type is string, default minimum length is 5.
    database_user: str = Field(min_length=5)
    # Define configuration item database_password, type is string, default minimum length is 10.
    database_password: str = Field(min_length=10)
    # Define configuration item api_key, type is string, default minimum length is 8.
    api_key: str = Field(min_length=8)

# Print the model information of the instantiated object of the configuration class for debugging and confirming the correctness of the configuration.
print(AppConfig().model_dump())
```

Execution result:
```
{'database_host': Url('http://baidu.com/'), 'database_user': '公众号：海哥python', 'database_password': '123456abcd', 'api_key': 'DHKSDsdh*(sdds'}
```

If it's a configuration file, etc., it can be configured via `model_config`.

Create a new `.env` configuration file:
```
DATABASE_HOST=http://baidu.com
DATABASE_USER=公众号：海哥python
DATABASE_PASSWORD=123456abcd
API_KEY=DHKSDsdh*(sdds
```

```python
# ! -*-conding: UTF-8 -*-
# @公众号: 海哥python
# Import Pydantic's HttpUrl and Field classes for configuration validation.
from pydantic import HttpUrl, Field
# Import BaseSettings and SettingsConfigDict classes to set the base behavior and configuration dictionary for the configuration class.
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppConfig(BaseSettings):
    """
    Application configuration class, inherits from BaseSettings, used to define and manage application configuration items.
    Attributes:
        model_config: Settings for configuring the model, used to specify the location of the .env file, encoding method, case sensitivity, and additional configuration strategies.
        database_host: URL of the database host, must be a valid HTTP or HTTPS URL.
        database_user: Name of the database user, minimum length is 5 characters.
        database_password: Password of the database user, minimum length is 10 characters.
        api_key: API key, minimum length is 8 characters.
    """
    # Define configuration model settings, including .env file location, encoding, case sensitivity, and extra parameter strategy.
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="forbid",
    )

    # URL of the database host, must be a valid HTTP or HTTPS URL.
    database_host: HttpUrl
    # Name of the database user, minimum length is 5 characters.
    database_user: str = Field(min_length=5)
    # Password of the database user, minimum length is 10 characters.
    database_password: str = Field(min_length=10)
    # API key, minimum length is 8 characters.
    api_key: str = Field(min_length=8)

# Print the model information of the instantiated object of the configuration class for debugging and confirming the correctness of the configuration.
print(AppConfig().model_dump())
```

Execution result:
```
{'database_host': Url('http://baidu.com/'), 'database_user': '公众号：海哥python', 'database_password': '123456abcd', 'api_key': 'DHKSDsdh*(sdds'}
```

### Nested Data Models

Pydantic supports nested data models, making it convenient to manage complex data structures. Here is an example code:

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from typing import List
from pydantic import BaseModel, conint

class Friend(BaseModel):
    name: str
    age: conint(gt=0, le=99)

class User(BaseModel):
    name: str
    age: conint(gt=0, le=99)
    friends: List[Friend]

# Create and validate data
user_data = {
    'name': '公众号：海哥python',
    'age': 30,
    'friends': [{'name': '小卤蛋', 'age': 3}, {'name': '李元芳', 'age': 18}]
}
user = User(**user_data)
print(user)  # name='公众号：海哥python' age=30 friends=[Friend(name='小卤蛋', age=3), Friend(name='李元芳', age=18)]
```

### Field Object

Pydantic's `Field` function is a powerful tool that allows you to set additional validation rules and default values on model fields. The `Field` function is usually used with model fields to provide more customization options.

Here are some commonly used parameters:

| Parameter           | Specific Meaning                                                                                                       |
|---------------------|-----------------------------------------------------------------------------------------------------------------------|
| `...`               | Indicates this field is required.                                                                                      |
| `default`           | Used to define the default value of a field.                                                                           |
| `default_factory`   | Used to define a default value function for a field.                                                                   |
| `alias`             | Define an alias for the field.                                                                                         |
| `validation_alias`  | Define an alias for the field, only want to use the alias for validation.                                              |
| `serialization_alias`| Define an alias for the field, only want to define an alias for serialization.                                         |
| `gt`, `lt`, `ge`, etc. | Constrain numerical values: greater than, less than, greater than or equal to, etc.                                    |
| `min_length`, `max_length`, etc. | Constrain strings.                                                                                                    |
| `min_items`, `max_items`, etc. | Constrain tuples, lists, or sets.                                                                                     |
| `validate_default`  | Control whether the default value of a field should be validated. By default, the default value of a field is not validated. |
| `strict`            | Specify whether the field should be validated in "strict mode".                                                        |
| `frozen`            | Used to simulate the behavior of frozen dataclasses.                                                                   |
| `exclude`           | Used to control which fields should be excluded from the model when exporting.                                          |
| `pattern`           | For string fields, you can set a `pattern` regular expression to match any pattern required for that field.            |

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from pydantic import BaseModel, Field, EmailStr, ValidationError, SecretStr
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    id: int = Field(..., alias="_id", frozen=True, strict=True)  # Set alias, id cannot be modified after creation, id cannot be passed as a string "123"
    name: str = Field(default="小卤蛋", min_length=1, max_length=100)  # Set default value, use min_length and max_length to limit string length.
    age: int = Field(gt=0)  # Supports various conditional validations, here assuming age must be greater than 0.
    email: EmailStr
    signup_ts: Optional[datetime] = Field(default_factory=datetime.now, nullable=False, validate_default=True)
    friends: List[str] = Field(default=[], min_items=0)
    passwd: SecretStr = Field(min_length=6, max_length=20, exclude=True)  # passwd will not be serialized.

if __name__ == '__main__':
    print(User.model_json_schema())
    user_data = {
        "_id": 123,  # Use alias _id
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        # 'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
        "passwd": "123456"
    }
    try:
        user = User(**user_data)
        print(f"创建用户: {user}")
        print(f"转成字典形式： {user.model_dump()} .... type: {type(user.model_dump())}")
        print(f"转成json格式：{user.model_dump_json()} .... type: {type(user.model_dump_json())}")
        print(f"用户属性： User id: {user.id}, User name: {user.name}, User email: {user.email}")
        # user.id = 456   # Modifying here will cause an error
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

Will get the result:
```
{'properties': {'_id': {'title': ' Id', 'type': 'integer'}, 'name': {'default': '小卤蛋', 'maxLength': 100, 'minLength': 1, 'title': 'Name', 'type': 'string'}, 'age': {'exclusiveMinimum': 0, 'title': 'Age', 'type': 'integer'}, 'email': {'format': 'email', 'title': 'Email', 'type': 'string'}, 'signup_ts': {'anyOf': [{'format': 'date-time', 'type': 'string'}, {'type': 'null'}], 'nullable': False, 'title': 'Signup Ts'}, 'friends': {'default': [], 'items': {'type': 'string'}, 'minItems': 0, 'title': 'Friends', 'type': 'array'}, 'passwd': {'maxLength': 20, 'minLength': 6, 'title': 'Passwd', 'type': 'string'}}, 'required': ['_id', 'age', 'email', 'passwd'], 'title': 'User', 'type': 'object'}
创建用户: id=123 name='小卤蛋' age=20 email='xiaoludan@example.com' signup_ts=datetime.datetime(2024, 7, 23, 11, 22, 46, 137194) friends=['公众号：海哥python', '小天才', ''] passwd='123456'
转成字典形式： {'id': 123, 'name': '小卤蛋', 'age': 20, 'email': 'xiaoludan@example.com', 'signup_ts': datetime.datetime(2024, 7, 23, 11, 22, 46, 137194), 'friends': ['公众号：海哥python', '小天才', '']} .... type: <class 'dict'>
转成json格式：{"id":123,"name":"小卤蛋","age":20,"email":"xiaoludan@example.com","signup_ts":"2024-07-23T11:22:46.137194","friends":["公众号：海哥python","小天才",""]} .... type: <class 'str'>
用户属性： User id: 123, User name: 小卤蛋, User email: xiaoludan@example.com
```

### Config Configuration Options

If you want to apply uniform formatting requirements to a basic type in `BaseModel`, you can also use the `Config` class to achieve this.

Here are some common attributes in the `Config` class and their meanings:

| Parameter           | Value Type | Specific Meaning                                                                                                  |
|---------------------|------------|------------------------------------------------------------------------------------------------------------------|
| `str_min_length`    | `int`      | Minimum length for `str` type. Default is `None`.                                                               |
| `str_max_length`    | `int`      | Maximum length for `str` type. Default is `None`.                                                               |
| `extra`             | `str`      | Whether to ignore, allow, or forbid extra attributes during model initialization. Default is `'ignore'`. `allow` - allow any extra attributes. `forbid` - forbid any extra attributes. `ignore` - ignore any extra attributes. |
| `frozen`            | `bool`     | Whether the model is mutable.                                                                                   |
| `str_to_upper`      | `bool`     | Whether to convert all characters of `str` type to uppercase. Default is `False`.                                |
| `str_strip_whitespace` | `bool`  | Whether to strip leading and trailing whitespace from `str` type.                                                |
| `str_to_lower`      | `bool`     | Whether to convert all characters of `str` type to lowercase. Default is `False`.                                |

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

    class Config:
        str_min_length = 10  # Minimum string length
        str_max_length = 20  # Maximum string length

user = User(name="John Doe", age=30)
```

Execution will get the result:
```
Validation error: [{"type":"string_too_short","loc":["name"],"msg":"String should have at least 10 characters","input":"John Doe","ctx":{"min_length":10},"url":"https://errors.pydantic.dev/2.5/v/string_too_short"}]
```

Regarding the special keyword names in the `Config` class, only two simple examples are given here. For more content, you can refer to the official documentation.

### Serialization

Using the model class `.model_dump()` method can convert a model class instance object into dictionary type data.

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ValidationError, EmailStr, field_validator, field_serializer
from enum import Enum

class GenderEnum(str, Enum):
    """
    Gender Enum
    """
    male = "男"
    female = "女"

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: int
    email: EmailStr
    signup_ts: Optional[datetime] = datetime.now()
    friends: List[str] = []
    sex: GenderEnum

    @field_validator("age")
    @classmethod
    def check_age(cls, age):
        if age < 18:
            raise ValueError("用户年龄必须大于18岁")
        return age

    @field_serializer('signup_ts', when_used="always")
    def serialize_signup_ts(self, value: datetime) -> str:
        return value.strftime('%Y-%m-%d %H:%M:%S')

    @field_serializer('sex', when_used="always")
    def serialize_sex(self, value) -> str:
        return value.value

if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        # 'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
        "sex": "男",
    }
    try:
        user = User.model_validate(user_data)
        print(f"{user.model_dump()} .... type: {type(user.model_dump())}")
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

By default, `datetime` objects are serialized as ISO 8601 strings. Here `field_serializer` is used to customize serialization rules.
```
{'id': 123, 'name': '小卤蛋', 'age': 20, 'email': 'xiaoludan@example.com', 'signup_ts': '2024-07-24 14:47:33', 'friends': ['公众号：海哥python', '小天才', ''], 'sex': '男'} .... type: <class 'dict'>
```

Using the model class `.model_dump_json()` method can convert a model class instance object into a JSON string.

```python
#! -*-conding: UTF-8 -*-
# @公众号: 海哥python
from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ValidationError, EmailStr, field_validator, field_serializer, model_serializer

class User(BaseModel):
    id: int
    name: str = "小卤蛋"
    age: int
    email: EmailStr
    signup_ts: Optional[datetime] = datetime.now()
    friends: List[str] = []

    @field_validator("age")
    @classmethod
    def check_age(cls, age):
        if age < 18:
            raise ValueError("用户年龄必须大于18岁")
        return age

    @field_serializer('signup_ts', when_used="json")
    def serialize_signup_ts(self, value: datetime) -> str:
        return value.strftime('%Y-%m-%d %H:%M:%S')

    @model_serializer(when_used="json")
    def serialize_model(self) -> dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age + 1,
            'email': self.email,
            'signup_ts': self.serialize_signup_ts(self.signup_ts),
            'friends': self.friends,
        }

if __name__ == '__main__':
    user_data = {
        "id": 123,
        "name": "小卤蛋",
        "age": 20,
        "email": "xiaoludan@example.com",
        # 'signup_ts': '2024-07-19 00:22',
        'friends': ["公众号：海哥python", '小天才', b''],
    }
    try:
        user = User.model_validate(user_data)
        print(f"{user.model_dump_json()} .... type: {type(user.model_dump_json())}")
        print(f"{user.model_dump()} .... type: {type(user.model_dump())}")
    except ValidationError as e:
        print(f"Validation error: {e.json()}")
```

You can also use `model_serializer` to customize the serialization of the entire model. The result is as follows:
```
{"id":123,"name":"小卤蛋","age":21,"email":"xiaoludan@example.com","signup_ts":"2024-07-24 14:17:42","friends":["
