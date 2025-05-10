# Entry point of the Flask app
from myapp import create_app  # Imports the factory function to create the app

app = create_app()  # Creates the Flask app with configurations and blueprints

if __name__ == "__main__":
    # Runs the app in debug mode for live reloads and detailed errors
    app.run(debug=True)
