from flask import Flask, render_template, request, redirect, url_for, flash
import joblib
import numpy as np
import traceback

app = Flask(__name__)
app.secret_key = "replace-with-a-secure-random-key"

# Load models
diabetes_model = joblib.load("models/diabetes_model.pkl")
heart_model = joblib.load("models/heart_model.pkl")
parkinson_model = joblib.load("models/parkinson_model.pkl")

@app.route("/")
def index():
    return render_template("index.html")


#########################
# Diabetes
#########################
@app.route("/diabetes", methods=["GET"])
def diabetes_form():
    return render_template("diabetes.html")


@app.route("/diabetes/predict", methods=["POST"])
def diabetes_predict():
    try:
        # Features must match the order used during training
        features = [
            float(request.form.get("Pregnancies", 0)),
            float(request.form.get("Glucose")),
            float(request.form.get("BloodPressure")),
            float(request.form.get("SkinThickness", 0)),
            float(request.form.get("Insulin", 0)),
            float(request.form.get("BMI")),
            float(request.form.get("DiabetesPedigreeFunction")),
            float(request.form.get("Age"))
        ]

        arr = np.array(features).reshape(1, -1)
        pred = diabetes_model.predict(arr)[0]
        prob = diabetes_model.predict_proba(arr)[0].max()

        result = "Positive for Diabetes" if pred == 1 else "Negative for Diabetes"
        return render_template("diabetes.html", result=result, prob=round(float(prob), 3))

    except Exception as e:
        traceback.print_exc()
        flash("Error during prediction: " + str(e))
        return redirect(url_for("diabetes_form"))


#########################
# Heart (11 FEATURES ONLY)
#########################
@app.route("/heart", methods=["GET"])
def heart_form():
    return render_template("heart.html")


@app.route("/heart/predict", methods=["POST"])
def heart_predict():
    try:
        # EXACT 11 FEATURES — matches your CSV and trained model
        features = [
            float(request.form.get("age")),
            float(request.form.get("sex")),
            float(request.form.get("cp")),
            float(request.form.get("trestbps")),
            float(request.form.get("chol")),
            float(request.form.get("fbs")),
            float(request.form.get("restecg")),
            float(request.form.get("thalach")),
            float(request.form.get("exang")),
            float(request.form.get("oldpeak")),
            float(request.form.get("slope"))
        ]

        arr = np.array(features).reshape(1, -1)

        pred = heart_model.predict(arr)[0]
        prob = heart_model.predict_proba(arr)[0].max()

        result = "High chance of Heart Disease" if pred == 1 else "Low chance of Heart Disease"

        return render_template("heart.html", result=result, prob=round(float(prob), 3))

    except Exception as e:
        traceback.print_exc()
        flash("Error during prediction: " + str(e))
        return redirect(url_for("heart_form"))


#########################
# Parkinson
#########################
@app.route("/parkinson", methods=["GET"])
def parkinson_form():
    return render_template("parkinson.html")


@app.route("/parkinson/predict", methods=["POST"])
def parkinson_predict():
    try:
        numeric_vals = []

        # Collect all numeric inputs except 'name' (text)
        for key, value in request.form.items():
            if key == "name":
                continue
            numeric_vals.append(float(value))

        arr = np.array(numeric_vals).reshape(1, -1)
        pred = parkinson_model.predict(arr)[0]
        prob = parkinson_model.predict_proba(arr)[0].max()

        result = "Parkinson's disease (likely)" if pred == 1 else "Parkinson's disease (unlikely)"

        return render_template("parkinson.html", result=result, prob=round(float(prob), 3))

    except Exception as e:
        traceback.print_exc()
        flash("Error during prediction: " + str(e))
        return redirect(url_for("parkinson_form"))


if __name__ == "__main__":
    app.run(debug=True)
