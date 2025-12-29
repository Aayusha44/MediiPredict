# train_models.py
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

def train_diabetes():
    df = pd.read_csv("data/diabetes.csv")
    # Ensure the standard PIMA layout (Outcome is target)
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipe = Pipeline([("scaler", StandardScaler()), ("rf", RandomForestClassifier(n_estimators=150, random_state=42))])
    pipe.fit(X_train, y_train)
    joblib.dump(pipe, "models/diabetes_model.pkl")
    print("Saved models/diabetes_model.pkl")

def train_heart():
    df = pd.read_csv("data/heart.csv")
    # assume 'target' column is label (0/1)
    if 'target' in df.columns:
        X = df.drop("target", axis=1)
        y = df['target']
    elif 'Target' in df.columns:
        X = df.drop("Target", axis=1)
        y = df['Target']
    else:
        raise ValueError("Heart dataset must have 'target' column")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipe = Pipeline([("scaler", StandardScaler()), ("rf", RandomForestClassifier(n_estimators=150, random_state=42))])
    pipe.fit(X_train, y_train)
    joblib.dump(pipe, "models/heart_model.pkl")
    print("Saved models/heart_model.pkl")

def train_parkinson():
    df = pd.read_csv("data/parkinsons.csv")
    # status is target (1 = Parkinson's)
    if 'status' not in df.columns:
        raise ValueError("Parkinson dataset must have 'status' column")
    X = df.drop(columns=['name','status'], errors='ignore')
    y = df['status']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipe = Pipeline([("scaler", StandardScaler()), ("rf", RandomForestClassifier(n_estimators=150, random_state=42))])
    pipe.fit(X_train, y_train)
    joblib.dump(pipe, "models/parkinson_model.pkl")
    print("Saved models/parkinson_model.pkl")

if __name__ == "__main__":
    train_diabetes()
    train_heart()
    train_parkinson()
    print("All models trained and saved.")
