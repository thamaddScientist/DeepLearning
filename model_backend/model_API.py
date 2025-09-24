import base64
from typing import Union

from PIL import Image
from fastapi import FastAPI,HTTPException
import torch
from torchvision import transforms
from pydantic import BaseModel
import io
from torch import nn
from fastapi.middleware.cors import CORSMiddleware



cinic_mean_RGB = [0.47889522, 0.47227842, 0.43047404]
cinic_std_RGB = [0.24205776, 0.23828046, 0.25874835]

CINIC_CLASSNAMES = ['airplane','automobile','bird','cat','deer','dog','frog','horse','ship','truck']

class ClassificationRequest(BaseModel):
    image_base64: str

class BatchNormalized(nn.Module):
    def __init__(self, input_features = 3 * 32 * 32, hidden_layer1 = 1024, hidden_layer2 = 512, hidden_layer3 = 256, output_features =10):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(input_features, 1024),  # input layer
            nn.ReLU(),  # activation function
            nn.BatchNorm1d(1024), # Batch Normalization
            nn.Linear(1024, 512),  # hidden layer (1st)
            nn.ReLU(),  # activation function
            nn.BatchNorm1d(512), # Batch Normalization
            nn.Linear(512, 256),  # hidden layer (1st)
            nn.ReLU(),  # activation function
            nn.Linear(256, 128),  # hidden layer (2nd)
            nn.ReLU(),  # activation function
            nn.BatchNorm1d(128), # Batch Normalization
            nn.Linear(128, 64), 
            nn.ReLU(),  # activation function
            nn.Linear(64, output_features),   # output logits
        )
    def forward(self, x):
            x = self.flatten(x)
            logits = self.linear_relu_stack(x)
            return logits
    
model = BatchNormalized().to()

# Define model
class VanillaDNN(nn.Module):
    def __init__(self, input_features = 3 * 32 * 32, hidden_layer1 = 1024, hidden_layer2 = 512, hidden_layer3 = 256, output_features =10):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(input_features, 1024),  # input layer
            nn.ReLU(),  # activation function
            nn.Linear(1024, 512),  # hidden layer (1st)
            nn.ReLU(),  # activation function
            nn.Linear(512, 256),  # hidden layer (1st)
            nn.ReLU(),  # activation function
            nn.Linear(256, 128),  # hidden layer (2nd)
            nn.ReLU(),  # activation function
            nn.Linear(128, 64), 
            nn.ReLU(),  # activation function
            nn.Linear(64, output_features),   # output logits
        )


    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

vanillaModel = VanillaDNN()
print(model)    
torch.manual_seed(63)                                                                                                                                                        


try:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_path = "./my_models/batchNormed.pth"
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    model.to(device)

except Exception as e:
    print(e)
    raise RuntimeError("Pytorch model failed to load")

transforms = transforms.Compose([
    transforms.Resize((32,32)),
    transforms.ToTensor(),
    transforms.Normalize(mean=cinic_mean_RGB,std=cinic_std_RGB)
])




app = FastAPI(
    title="Image Classification API",
    description="A simple API to classify images using a pre-trained PyTorch model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/deep_prediction")
async def run_prediction(request:ClassificationRequest):
    try:
        if "," in request.image_base64:
            image_base64_data = request.image_base64.split(",")[1]
        else:
            image_base64_data = request.image_base64
        image_bytes = base64.b64decode(image_base64_data)
        image_stream = io.BytesIO(image_bytes)
        image = Image.open(image_stream).convert("RGB")
        img_t = transforms(image).unsqueeze(0)
        img_t = img_t.to(device)

        # Use the model to make a prediction
        with torch.no_grad():
            out = vanillaModel(img_t)
        
        probability_dist = torch.nn.functional.softmax(out, dim=1)

        # Get the top prediction
        print(out)
        pred_values, predicted_idx = torch.max(probability_dist * 100, 1)
        predicted_class_idx = predicted_idx.item()
        try:
            predicted_class_name = CINIC_CLASSNAMES[predicted_class_idx]
        except IndexError:
            predicted_class_name = f"Class index {predicted_class_idx} not in dummy list."

        return {
            "prediction": predicted_class_name,
            "class_index": predicted_class_idx,
            "message": "Image classified successfully.",
            "pred_value": pred_values.item()
        }
        pass
    except Exception as e:
        print(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/cnn_prediction")
async def run_prediction(request:ClassificationRequest):
    try:
        if "," in request.image_base64:
            image_base64_data = request.image_base64.split(",")[1]
        else:
            image_base64_data = request.image_base64
        image_bytes = base64.b64decode(image_base64_data)
        image_stream = io.BytesIO(image_bytes)
        image = Image.open(image_stream).convert("RGB")
        img_t = transforms(image).unsqueeze(0)
        img_t = img_t.to(device)

        # Use the model to make a prediction
        with torch.no_grad():
            out = model(img_t)
        
        probability_dist = torch.nn.functional.softmax(out, dim=1)

        # Get the top prediction
        print(out)
        pred_values, predicted_idx = torch.max(probability_dist * 100, 1)
        predicted_class_idx = predicted_idx.item()
        try:
            predicted_class_name = CINIC_CLASSNAMES[predicted_class_idx]
        except IndexError:
            predicted_class_name = f"Class index {predicted_class_idx} not in dummy list."

        return {
            "prediction": predicted_class_name,
            "class_index": predicted_class_idx,
            "message": "Image classified successfully.",
            "pred_value": pred_values.item()
        }
        pass
    except Exception as e:
        print(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_prediction")
async def run_prediction(request:ClassificationRequest):
    try:
        if "," in request.image_base64:
            image_base64_data = request.image_base64.split(",")[1]
        else:
            image_base64_data = request.image_base64
        image_bytes = base64.b64decode(image_base64_data)
        image_stream = io.BytesIO(image_bytes)
        image = Image.open(image_stream).convert("RGB")
        img_t = transforms(image).unsqueeze(0)
        img_t = img_t.to(device)

        # Use the model to make a prediction
        with torch.no_grad():
            out = model(img_t)
        
        probability_dist = torch.nn.functional.softmax(out, dim=1)

        # Get the top prediction
        print(out)
        pred_values, predicted_idx = torch.max(probability_dist * 100, 1)
        predicted_class_idx = predicted_idx.item()
        try:
            predicted_class_name = CINIC_CLASSNAMES[predicted_class_idx]
        except IndexError:
            predicted_class_name = f"Class index {predicted_class_idx} not in dummy list."

        return {
            "prediction": predicted_class_name,
            "class_index": predicted_class_idx,
            "message": "Image classified successfully.",
            "pred_value": pred_values.item()
        }
        pass
    except Exception as e:
        print(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))