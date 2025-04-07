import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  price: number;
};

const MoviePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cart, setCart] = useState<Movie[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const apiKey = '32c1739fe4f1af5dcd26a126697ce7fc';

  const fetchMovies = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${search}`
    );
    const results = res.data.results.map((m: any) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      price: Math.floor(Math.random() * 200) + 100,
    }));
    setMovies(results);
  };

  const addToCart = (movie: Movie) => {
    if (!cart.find((item) => item.id === movie.id)) {
      const updatedCart = [...cart, movie];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); 
  };

  const handlePurchase = () => {
    setShowPopup(true);
    setCountdown(60);
  };

  const calculateDiscount = () => {
    const total = cart.reduce((sum, m) => sum + m.price, 0);
    if (cart.length > 5) return total * 0.2;
    if (cart.length > 3) return total * 0.1;
    return 0;
  };

  const calculateTotal = () => {
    const total = cart.reduce((sum, m) => sum + m.price, 0);
    return (total - calculateDiscount()).toFixed(2);
  };

  useEffect(() => {
    if (search) fetchMovies();
  }, [search]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showPopup, countdown]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🎬 ค้นหาภาพยนตร์</h1>
  
      <div className="input-group mb-4 d-flex justify-content-end">
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหาชื่อหนัง"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
  
      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card">
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                alt={movie.title}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">💵 ราคา: {movie.price} บาท</p>
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(movie)}
                >
                  🛒 ใส่ตะกร้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
  
     
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1050, width: '300px' }}
      >
        <h2>🛍️ ตะกร้าสินค้า</h2>
        {cart.length === 0 ? (
          <p>ยังไม่มีรายการในตะกร้า</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.title} - {item.price} บาท
                </li>
              ))}
            </ul>
            <p>🧾 ราคารวมก่อนลด: {cart.reduce((sum, m) => sum + m.price, 0)} บาท</p>
            {calculateDiscount() > 0 && (
              <p className="text-success">🎉 ส่วนลด: {calculateDiscount().toFixed(2)} บาท</p>
            )}
            <p>
              💰 ยอดสุทธิที่ต้องจ่าย: <strong>{calculateTotal()} บาท</strong>
            </p>
            <button className="btn btn-danger" onClick={clearCart}>
              🧹 ล้างตะกร้า
            </button>
            <button
              className="btn btn-success ml-2"
              onClick={handlePurchase}
            >
              ✅ สั่งซื้อ
            </button>
          </>
        )}
      </div>
  
     
      {showPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
        >
          <div className="bg-white p-4 rounded-3 text-center" style={{ width: '300px' }}>
            <h3>💳 ชำระเงิน</h3>
            <p>ยอดที่ต้องโอน: {calculateTotal()} บาท</p>
            <p>บัญชี: ธนาคาร ABC เลขที่ 123-456-7890</p>
            <p>⏳ เวลาที่เหลือ: {countdown} วินาที</p>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowPopup(false)}
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default MoviePage;
