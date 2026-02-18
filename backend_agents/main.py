from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crewai import Crew, Process
from backend_agents.agents import PurposePayAgents
from langchain.tools import tool

app = FastAPI()

class SimulationRequest(BaseModel):
    item: str
    quantity: int
    vendor_id: str
    farmer_id: str

@app.post("/run-agents")
async def run_agents(request: SimulationRequest):
    try:
        # Initialize Agents
        agents = PurposePayAgents()
        broker = agents.broker_agent()
        escrow = agents.escrow_agent()
        recovery = agents.recovery_agent()

        # Define Tasks (Dynamically created for the simulation)
        from crewai import Task

        task1 = Task(
            description=f"Verify the market price for {request.quantity} units of {request.item}. Check if {request.vendor_id} is a valid vendor.",
            agent=broker
        )

        task2 = Task(
            description=f"Upon verification, execute a payment for the total amount to {request.vendor_id}. Do NOT transfer to the farmer.",
            agent=escrow
        )

        task3 = Task(
            description=f"Link the transaction to Farmer {request.farmer_id}'s harvest ID and set up an auto-deduction schedule.",
            agent=recovery
        )

        # Create Crew
        purpose_crew = Crew(
            agents=[broker, escrow, recovery],
            tasks=[task1, task2, task3],
            verbose=2,
            process=Process.sequential
        )

        # Run Crew
        result = purpose_crew.kickoff()

        return {
            "status": "success",
            "result": result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# ... existing imports ...
import torch
import numpy as np
from backend_agents.gnn_train import SimpleGCN, feat_dim, cluster_names, A_norm, X_t, device

# Load GNN Model
gnn_model = SimpleGCN(feat_dim, 32, len(cluster_names)).to(device)
try:
    checkpoint = torch.load("backend_agents/gnn_model.pth", map_location=device)
    gnn_model.load_state_dict(checkpoint["model_state"])
    gnn_model.eval()
    print("GNN Model loaded successfully.")
except Exception as e:
    print(f"Failed to load GNN model: {e}")

@app.get("/predict-risk")
async def predict_risk():
    try:
        with torch.no_grad():
            logits = gnn_model(X_t, A_norm)
            probs = torch.softmax(logits, dim=1)
            
            # For demo: Return score for the 'user' node (index 0)
            # We assume 'user' is node 0 in NODES list.
            # Risk = 1 - probability of "income" or "savings" cluster (identifying stability)
            # Actually, let's just use the max probability as a "confidence" score for stability
            
            user_probs = probs[0].cpu().numpy()
            confidence = float(np.max(user_probs))
            
            # Normalize to 0-1 Risk Score (Inverse of confidence for demo)
            risk_score = round(1.0 - confidence, 2)
            
            return {
                "status": "success",
                "risk_score": risk_score,
                "confidence": round(confidence, 2),
                "details": {
                    "relational_stability": "High" if confidence > 0.7 else "Moderate",
                    "volatility_exposure": "Low" if risk_score < 0.3 else "High"
                }
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
