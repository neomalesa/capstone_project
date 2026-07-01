import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const Footer = () => {
  const { currency, currencySymbol, setCurrency } = useCurrency();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety information</a></li>
            <li><a href="#">Cancellation options</a></li>
            <li><a href="#">Our COVID-19 Response</a></li>
            <li><a href="#">Supporting people with disabilities</a></li>
            <li><a href="#">Report a neighborhood concern</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Community</h4>
          <ul>
            <li><a href="#">Airbnb.org: disaster relief housing</a></li>
            <li><a href="#">Support Afghan refugees</a></li>
            <li><a href="#">Celebrating diversity & belonging</a></li>
            <li><a href="#">Combating discrimination</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Hosting</h4>
          <ul>
            <li><a href="#">Try hosting</a></li>
            <li><a href="#">AirCover: protection for Hosts</a></li>
            <li><a href="#">Explore hosting resources</a></li>
            <li><a href="#">Visit our community forum</a></li>
            <li><a href="#">How to host responsibly</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li><a href="#">Newsroom</a></li>
            <li><a href="#">Learn about new features</a></li>
            <li><a href="#">Letter from our founders</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Investors</a></li>
            <li><a href="#">Airbnb Luxe</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid #DDDDDD', fontSize: '14px', color: '#222222', marginTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>© 2026 Airbnb, Inc.</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontWeight: '500' }}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor', marginRight: '6px' }}><path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z"></path></svg>
              <select style={{ appearance: 'none', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: '500', color: 'inherit', cursor: 'pointer', outline: 'none' }}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ marginRight: '4px' }}>{currencySymbol}</span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ appearance: 'none', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: '500', color: 'inherit', cursor: 'pointer', outline: 'none' }}
              >
                <option value="zar">ZAR</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="#" style={{ color: 'inherit' }}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}><path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.48 4.74 11.85 10.97 12.84v-9.08H10.67v-3.76h3.3v-2.87c0-3.26 1.94-5.06 4.9-5.06 1.42 0 2.9.25 2.9.25v3.19h-1.63c-1.61 0-2.12 1-2.12 2.03v2.46h3.6l-.58 3.76h-3.02v9.08C24.26 27.85 29 22.48 29 16z"></path></svg>
            </a>
            <a href="#" style={{ color: 'inherit' }}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}><path d="M25.32 2H31L20.21 15.65 31.95 30h-9.98l-7.23-9.59-8.48 9.59H.71L12.3 15.22 1 2h10.43l6.53 8.78L25.32 2zm-1.74 25.43h3.15L8.53 4.41H5.16l18.42 23.02z"></path></svg>
            </a>
            <a href="#" style={{ color: 'inherit' }}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}><path d="M16 4.2c3.84 0 4.29.02 5.81.09 1.4.06 2.16.3 2.67.5.67.26 1.15.58 1.63 1.06.48.48.8.96 1.06 1.63.2.5.44 1.26.5 2.67.07 1.52.09 1.97.09 5.81s-.02 4.29-.09 5.81c-.06 1.4-.3 2.16-.5 2.67-.26.67-.58 1.15-1.06 1.63-.48.48-.96.8-1.63 1.06-.5.2-1.26.44-2.67.5-1.52.07-1.97.09-5.81.09s-4.29-.02-5.81-.09c-1.4-.06-2.16-.3-2.67-.5-.67-.26-1.15-.58-1.63-1.06-.48-.48-.8-.96-1.06-1.63-.2-.5-.44-1.26-.5-2.67-.07-1.52-.09-1.97-.09-5.81s.02-4.29.09-5.81c.06-1.4.3-2.16.5-2.67.26-.67.58-1.15 1.06-1.63.48-.48.96-.8 1.63-1.06.5-.2 1.26-.44 2.67-.5 1.52-.07 1.97-.09 5.81-.09M16 2c-3.9 0-4.39.02-5.92.09-1.53.07-2.58.31-3.49.67-.94.36-1.74.85-2.54 1.65-.8.8-1.29 1.6-1.65 2.54-.36.91-.6 1.96-.67 3.49C1.62 11.61 1.6 12.1 1.6 16s.02 4.39.09 5.92c.07 1.53.31 2.58.67 3.49.36.94.85 1.74 1.65 2.54.8.8 1.6 1.29 2.54 1.65.91.36 1.96.6 3.49.67 1.53.07 2.02.09 5.92.09s4.39-.02 5.92-.09c1.53-.07 2.58-.31 3.49-.67.94-.36 1.74-.85 2.54-1.65.8-.8 1.29-1.6 1.65-2.54.36-.91.6-1.96.67-3.49.07-1.53.09-2.02.09-5.92s-.02-4.39-.09-5.92c-.07-1.53-.31-2.58-.67-3.49-.36-.94-.85-1.74-1.65-2.54-.8-.8-1.6-1.29-2.54-1.65-.91-.36-1.96-.6-3.49-.67C20.39 2.02 19.9 2 16 2zM16 8.81A7.19 7.19 0 1 0 16 23.2a7.19 7.19 0 0 0 0-14.38zm0 11.88a4.69 4.69 0 1 1 0-9.38 4.69 4.69 0 0 1 0 9.38zm6.54-11.48a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
