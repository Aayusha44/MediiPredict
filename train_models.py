# train_models.py
import os
import pandas as pd
import numpy as np
import joblib

# Create directories if they don't exist
os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

def train_diabetes():
    if not os.path.exists("data/diabetes.csv"):
        print("data/diabetes.csv not found, skipping training")
        return
    try:
        from sklearn.ensemble import GradientBoostingClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline
        from sklearn.model_selection import train_test_split
        
        df = pd.read_csv("data/diabetes.csv")
        X = df.drop("Outcome", axis=1)
        y = df["Outcome"]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        pipe = Pipeline([
            ("scaler", StandardScaler()), 
            ("gbm", GradientBoostingClassifier(n_estimators=100, random_state=42))
        ])
        pipe.fit(X_train, y_train)
        joblib.dump(pipe, "models/diabetes_model.pkl")
        print("Saved models/diabetes_model.pkl")
    except Exception as e:
        print(f"Error training diabetes: {e}")

def train_heart():
    if not os.path.exists("data/heart.csv"):
        print("data/heart.csv not found, skipping training")
        return
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline
        from sklearn.model_selection import train_test_split
        
        df = pd.read_csv("data/heart.csv")
        target_col = 'target' if 'target' in df.columns else 'Target'
        X = df.drop(target_col, axis=1)
        y = df[target_col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        pipe = Pipeline([
            ("scaler", StandardScaler()), 
            ("rf", RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        pipe.fit(X_train, y_train)
        joblib.dump(pipe, "models/heart_model.pkl")
        print("Saved models/heart_model.pkl")
    except Exception as e:
        print(f"Error training heart: {e}")

def train_parkinson():
    if not os.path.exists("data/parkinsons.csv"):
        print("data/parkinsons.csv not found, skipping training")
        return
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline
        from sklearn.model_selection import train_test_split
        
        df = pd.read_csv("data/parkinsons.csv")
        X = df.drop(columns=['name', 'status'], errors='ignore')
        y = df['status']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        pipe = Pipeline([
            ("scaler", StandardScaler()), 
            ("rf", RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        pipe.fit(X_train, y_train)
        joblib.dump(pipe, "models/parkinson_model.pkl")
        print("Saved models/parkinson_model.pkl")
    except Exception as e:
        print(f"Error training parkinson: {e}")

if __name__ == "__main__":
    train_diabetes()
    train_heart()
    train_parkinson()
    print("Training process finished.")
