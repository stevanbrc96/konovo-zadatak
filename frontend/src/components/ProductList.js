import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './ProductList.module.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [allCategories, setAllCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const fetchInitialData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products', {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if (!response.ok) throw new Error('Autorizacija neuspešna.');

                const allProducts = await response.json();
                const categories = [...new Set(allProducts.map(p => p.categoryName).filter(Boolean))];
                setAllCategories(categories);
            } catch (err) {
                console.error("Greška pri dohvatanju kategorija:", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        setIsLoading(true);

        const fetchFilteredProducts = async () => {
            const params = new URLSearchParams({
                search: searchTerm,
                category: selectedCategory
            });
            const url = `http://127.0.0.1:5000/api/products?${params.toString()}`;

            try {
                const response = await fetch(url, {headers: {'Authorization': `Bearer ${token}`}});
                if (!response.ok) throw new Error('Autorizacija neuspešna. Molimo prijavite se ponovo.');

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
                localStorage.removeItem('jwt');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };


        const debounceTimeout = setTimeout(() => {
            fetchFilteredProducts();
        }, 300);


        return () => clearTimeout(debounceTimeout);

    }, [searchTerm, selectedCategory, navigate]);


    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };


    if (isLoading && products.length === 0) {
        return <div>Učitavanje proizvoda...</div>;
    }


    if (error) {
        return <div>Došlo je do greške: {error}</div>;
    }


    return (
        <div>
            <header className={styles.header}>
                <h1>Naši proizvodi</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>Odjavi se</button>
            </header>

            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Pretraži po nazivu..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={styles.categorySelect}
                >
                    <option value="">Sve kategorije</option>
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className={styles.productListGrid}>
                {products.map(product => (
                    <Link
                        to={`/products/${product.sif_product}`}
                        key={product.sif_product}
                        className={styles.productCardLink}
                    >
                        <div className={styles.productCard}>
                            <img src={product.imgsrc} alt={product.naziv} className={styles.productImage}/>
                            <div className={styles.cardContent}>
                                <h3>{product.naziv}</h3>
                                <p>Kategorija: {product.categoryName}</p>
                                <p className={styles.price}>{parseFloat(product.price).toFixed(2)} RSD</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ProductList;