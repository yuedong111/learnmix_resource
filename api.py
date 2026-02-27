import requests, json
url = "https://login.partner.microsoftonline.cn/3087d43f-6312-4c31-9362-8ee6d9182985/oauth2/v2.0/token"
body = {
    "grant_type":"client_credentials",
    "client_id":"4e43b46c-3e09-42ad-8928-8fdc6ec49dd5",
    "client_secret":"~73lQwGXPa4.Km88A0_Bp54ng_.0263MHa",
    "scope":"api://3a36a3de-d16b-4c7b-a61a-efdcfa2a429f/.default"
}
 
header = {
    "Content-Type":"application/x-www-form-urlencoded"
}

r = requests.post(url, data=body, headers=header)
# print(r.json())
token = r.json().get("access_token")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}


# query = """
# query {
  
#   eRH_DH_MD_Product_D_File_push(filter: { Update_Ts: { gt: "2025-08-16T00:00:00.000Z" } }) {
#     endCursor
#     hasNextPage
#     items {
#         ID_Nbr
#         SK_BU_Product
#         Update_Ts
        
#     }
#   }
# }

# """.strip()



def total_count(table_name, col_name):
    query = f"""
query {{
  
  {table_name} {{
    endCursor
    hasNextPage
    items {{
        {" \n".join(col_name)}
        
    }}
  }}
}}
"""
    payload = {
        "query": query,
        # "variables": {},
    }
    url1 = "https://datahub-api-qa.fonterrachina.com.cn/graphql"
    result = []
    resp = requests.post(url1, headers=headers, json=payload, timeout=3)
    res = resp.json().get("data").get(table_name)
    endcursor = res.get("endCursor")
    hasNextPage = res.get("hasNextPage")
    items = res.get("items")
    result.extend(items)
    # result.extend([json.dumps(i, ensure_ascii=False, sort_keys=True) for i in items])
    while hasNextPage:
        query = f"""
query {{
  
  {table_name}(after: "{endcursor}") {{
    endCursor
    hasNextPage
    items {{
        {" \n".join(col_name)}
        
    }}
  }}
}}
"""
        payload = {
            "query": query,
            # "variables": {},
        }
        resp = requests.post(url1, headers=headers, json=payload, timeout=3)
        res = resp.json().get("data").get(table_name)
        endcursor = res.get("endCursor")
        hasNextPage = res.get("hasNextPage")
        items = res.get("items")
        result.extend(items)
        # result.extend([json.dumps(i, ensure_ascii=False, sort_keys=True) for i in items])
    # result = list(set(result))
    # for i, item in enumerate(result):
        # print(i+1, item)
    print(len(result))


total_count("eRH_DH_MD_Product_D_File_push", ["ID_Nbr", "SK_BU_Product", "Update_Ts", "Product_Nm", "Product_Cd", "Commercial_Cd", "Alternative_Unit_of_Measure_Qty_Mt"])