# Smart Mirror Voice Assistant with Avatar

This project is an AI-powered smart mirror voice assistant with an animated avatar. It provides real-time information and interacts with users using voice commands.

## Features
- Voice-controlled assistant using JavaScript.
- AI-powered chatbot with document-based retrieval (FAISS + Hugging Face).
- 3D avatar with lip sync and animations.
- Dark-themed UI optimized for a smart mirror.

## Folder Structure
📂 smart-mirror
 ┣ 📂 assets/               # Stores the 3D avatar GLB file
 ┣ 📂 dataset/              # Stores PDFs for the voice assistant
 ┣ 📂 vectorstore/          # Stores FAISS embeddings
 ┃ 📜 script.js           # Controls avatar animations & lip sync
 ┃ 📜 assistant.js        # Handles voice recognition & chatbot logic
 ┣ 📜 index.html            # Frontend interface
 ┣ 📜 main.py               # FastAPI backend
 ┣ 📜 pdf_processing.py     # PDF document processing
 ┣ 📜 requirements.txt      # Dependencies
 ┗ 📜 README.md             # Project guide

## Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/Abijith-V-001/smart-mirror-assistant.git
cd smart-mirror

###2️⃣ Install Dependencies

pip install -r requirements.txt

###3️⃣ Process PDF Documents

python pdf_processing.py

###4️⃣ Run the Backend Server

uvicorn main:app --reload

###5️⃣ Start the Smart Mirror Interface

live-server
