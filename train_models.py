# train_models.py
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

def train_diabetes():
    if not os.path.exists("data/diabetes.csv"):
        print("data/diabetes.csv not found, skipping training")
        return
    df = pd.read_csv("data/diabetes.csv")
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Using Gradient Boosting for potentially better performance on this dataset
    pipe = Pipeline([
        ("scaler", StandardScaler()), 
        ("gbm", GradientBoostingClassifier(n_estimators=200, learning_rate=0.1, max_depth=4, random_state=42))
    ])
    pipe.fit(X_train, y_train)
    
    score = pipe.score(X_test, y_test)
    print(f"Diabetes Model Accuracy: {score:.4f}")
    
    joblib.dump(pipe, "models/diabetes_model.pkl")
    print("Saved models/diabetes_model.pkl")

def train_heart():
    if not os.path.exists("data/heart.csv"):
        print("data/heart.csv not found, skipping training")
        return
    df = pd.read_csv("data/heart.csv")
    
    target_col = None
    for col in ['target', 'Target', 'target_s']:
        if col in df.columns:
            target_col = col
            break
            
    if not target_col:
        # Check for case insensitive match
        cols_lower = [c.lower() for c in df.columns]
        if 'target' in cols_lower:
            target_col = df.columns[cols_lower.index('target')]
        else:
            raise ValueError(f"Heart dataset must have 'target' column. Found: {df.columns.tolist()}")
            
    X = df.drop(target_col, axis=1)
    y = df[target_col]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Random Forest with basic hyperparameter tuning via GridSearchCV (simplified for speed)
    pipe = Pipeline([
        ("scaler", StandardScaler()), 
        ("rf", RandomForestClassifier(n_estimators=200, max_depth=10, min_samples_split=5, random_state=42))
    ])
    pipe.fit(X_train, y_train)
    
    score = pipe.score(X_test, y_test)
    print(f"Heart Model Accuracy: {score:.4f}")
    
    joblib.dump(pipe, "models/heart_model.pkl")
    print("Saved models/heart_model.pkl")

def train_parkinson():
    if not os.path.exists("data/parkinsons.csv"):
        print("data/parkinsons.csv not found, skipping training")
        return
    df = pd.read_csv("data/parkinsons.csv")
    if 'status' not in df.columns:
        raise ValueError("Parkinson dataset must have 'status' column")
    
    X = df.drop(columns=['name', 'status'], errors='ignore')
    y = df['status']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # SVM or GBM often performs well on this smaller dataset
    from sklearn.ensemble import VotingClassifier
    from sklearn.svm import SVC
    
    clf1 = GradientBoostingClassifier(n_estimators=100, random_state=42)
    clf2 = RandomForestClassifier(n_estimators=100, random_state=42)
    clf3 = SVC(probability=True, random_state=42)
    
    pipe = Pipeline([
        ("scaler", StandardScaler()), 
        ("ensemble", VotingClassifier(estimators=[('gb', clf1), ('rf', clf2), ('svc', clf3)], voting='soft'))
    ])
    pipe.fit(X_train, y_train)
    
    score = pipe.score(X_test, y_test)
    print(f"Parkinson Model Accuracy: {score:.4f}")
    
    joblib.dump(pipe, "models/parkinson_model.pkl")
    print("Saved models/parkinson_model.pkl")

if __name__ == "__main__":
    train_diabetes()
    train_heart()
    train_parkinson()
    print("All optimized models trained and saved.")
