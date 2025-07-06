import re
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Korisničko ime i lozinka su obavezni"}), 400

    external_login_url = "https://zadatak.konovo.rs/login"
    try:
        response = requests.post(external_login_url, json=data)
        response.raise_for_status()


        return jsonify(response.json()), response.status_code
        
    except requests.exceptions.HTTPError as e:

        return jsonify(e.response.json()), e.response.status_code
    except requests.exceptions.RequestException as e:

        return jsonify({"error": "Greška pri komunikaciji sa login servisom", "details": str(e)}), 502




@app.route('/api/products', methods=['GET'])
def get_products():

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header je neophodan"}), 401

    external_products_url = "https://zadatak.konovo.rs/products"
    headers = { 'Authorization': auth_header }
    try:
        response = requests.get(external_products_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Greška pri komunikaciji sa eksternim API-jem", "details": str(e)}), 502

    products = response.json()
    processed_products = []


    for product in products:
        if product.get('categoryName') == 'Monitori':
            product['price'] = round(product['price'] * 1.10, 2)
        if 'description' in product and product['description']:
            product['description'] = re.sub('brzina', 'performanse', product['description'], flags=re.IGNORECASE)
        processed_products.append(product)


    search_query = request.args.get('search', '').lower()
    category_filter = request.args.get('category', '').lower()

    final_results = processed_products


    if category_filter:

        final_results = [
            p for p in final_results if p.get('categoryName') and p.get('categoryName').lower() == category_filter
        ]
    

    if search_query:

        final_results = [
            p for p in final_results if p.get('naziv') and search_query in p.get('naziv').lower()
        ]

    return jsonify(final_results)



@app.route('/api/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header je neophodan"}), 401


    external_products_url = "https://zadatak.konovo.rs/products"
    headers = { 'Authorization': auth_header }
    try:
        response = requests.get(external_products_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException:
        return jsonify({"error": "Greška pri komunikaciji sa eksternim API-jem"}), 502

    products = response.json()


    target_product = None
    for p in products:

        if p.get('sif_product') == product_id:
            target_product = p
            break


    if not target_product:
        return jsonify({"error": "Proizvod nije pronađen"}), 404


    if target_product.get('categoryName') == 'Monitori':
        target_product['price'] = round(target_product['price'] * 1.10, 2)
    if 'description' in target_product and target_product['description']:
        target_product['description'] = re.sub('brzina', 'performanse', target_product['description'], flags=re.IGNORECASE)

    return jsonify(target_product)



if __name__ == '__main__':

    app.run(debug=True, port=5000)