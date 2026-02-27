from docstrange import DocumentExtractor

# Initialize extractor (cloud mode by default)
extractor = DocumentExtractor(cpu=True)

# Convert any document to clean markdown
result = extractor.extract("dentalmeteral.pdf")
markdown = result.extract_markdown()
print(markdown)