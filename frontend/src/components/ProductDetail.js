import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';

function ProductDetail() {
    const {id} = useParams();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('jwt');
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });

                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else if (response.status === 404) {
                    setError('Proizvod nije pronađen.');
                } else {
                    throw new Error('Autorizacija neuspešna.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) return <div>Učitavanje...</div>;
    if (error) return <div>Greška: {error}</div>;
    if (!product) return <div>Proizvod nije pronađen.</div>;

    return (
        <div style={{
            maxWidth: '900px',
            margin: '2rem auto',
            padding: '2rem',
            background: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
            <Link to="/products" style={{marginBottom: '2rem', display: 'inline-block'}}>&larr; Nazad na sve
                proizvode</Link>
            <div style={{display: 'flex', gap: '2rem'}}>
                <img src={product.imgsrc} alt={product.naziv} style={{maxWidth: '400px', borderRadius: '8px'}}/>
                <div>
                    <h1>{product.naziv}</h1>
                    <p><strong>Kategorija:</strong> {product.categoryName}</p>
                    <p><strong>Brend:</strong> {product.brandName}</p>
                    <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{parseFloat(product.price).toFixed(2)} RSD</p>
                    <div style={{lineHeight: '1.6'}}>
                        <h3>Opis</h3>
                        {}
                        <div dangerouslySetInnerHTML={{__html: product.description}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;