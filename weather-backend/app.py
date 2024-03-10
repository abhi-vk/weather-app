from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from flask_cors import CORS  # Import CORS from flask_cors module
from datetime import datetime, timedelta
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'asdhashjlklasdjhjbsjfjlaldjkbjhksjddfjlasdb'

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Abhi-2002@localhost/weather-app'  # Replace with your database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.app_context().push()

# Configure Flask-Caching
app.config['CACHE_TYPE'] = 'simple'
cache = Cache(app)

# Define Weather model
class Weather(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    icon = db.Column(db.String(20))
    description = db.Column(db.String(100))
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Weather for {self.city}>'
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Route for user signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if username is already taken
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password before saving to the database
    hashed_password = generate_password_hash(password)

    # Create new user
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if user exists
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401

    # Check if password is correct
    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    # Generate access token
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200

# Endpoint to fetch weather data for a city
@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400
    
    # Check cache first
    cached_weather = cache.get(city)
    if cached_weather:
        return jsonify(cached_weather), 200
    
    # If not in cache, fetch from database
    weather = Weather.query.filter_by(city=city).first()
    if weather:
        # Check if weather data needs to be updated
        if datetime.utcnow() - weather.last_updated > timedelta(hours=1):
            # Weather data is stale, update it
            weather_data = update_weather_data(city)
        else:
            # Weather data is up-to-date
            weather_data = {
                'city': weather.city,
                'temperature': weather.temperature,
                'humidity': weather.humidity,
                'icon': weather.icon,
                'description': weather.description
            }
            # Update cache
            cache.set(city, weather_data, timeout=3600)
    else:
        # Weather data not found in database, fetch from WeatherAPI
        weather_data = update_weather_data(city)
    
    return jsonify(weather_data), 200

def update_weather_data(city):
    API_KEY = "192e3aaf21ff4c0eaab95337240503"  
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        try:
            temperature = data['current']['temp_c']
            humidity = data['current']['humidity']
            icon = data['current']['condition']['icon'].split('/')[-1].split('.')[0]
            description = data['current']['condition']['text']

            # Save data to database
            weather = Weather(city=city,
                              temperature=temperature,
                              humidity=humidity,
                              icon=icon,
                              description=description)
            db.session.add(weather)
            db.session.commit()
            # Update cache
            weather_data = {
                'city': city,
                'temperature': temperature,
                'humidity': humidity,
                'icon': icon,
                'description': description
            }
            cache.set(city, weather_data, timeout=3600)
            return weather_data
        except KeyError as e:
            return {'error': f'KeyError: {e}'}
    else:
        return {'error': f'Request failed with status code {response.status_code}: {response.text}'}


if __name__ == '__main__':
    app.run(debug=True)
