import os
import faiss
import pickle
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader

DATASET_DIR = "dataset"  # Folder where PDFs are stored
VECTOR_STORE_PATH = "vectorstore"  # Folder to save embeddings

# Function to process PDFs and store embeddings
def process_pdfs():
    documents = []
    for file in os.listdir(DATASET_DIR):
        if file.endswith(".pdf"):
            pdf_path = os.path.join(DATASET_DIR, file)
            print(f"Processing {pdf_path}...")
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    # Convert texts into embeddings
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vectorstore = FAISS.from_documents(texts, embeddings)

    # Save vectorstore to disk
    vectorstore.save_local(VECTOR_STORE_PATH)
    print("✅ PDF Processing Completed & Saved Embeddings!")

# Run the function when the script is executed
if __name__ == "__main__":
    process_pdfs()
