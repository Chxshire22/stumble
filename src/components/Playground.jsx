// import { Form } from "react-bootstrap";

import { useState } from "react";

function Playground() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="authentication">
      <header className="auth-header">
        <div className="auth-header-logo">
          <img
            className="logo-earth"
            src="src/assets/images/flamenco-134.webp"
            alt=""
          />
        </div>
        <div className="auth-header-content">
          <h1 className="auth-page-header">Stumble</h1>
          <p className="tagline"> explore with us</p>
        </div>
      </header>
      <form>
        <input
          autoFocus
          placeholder="Email"
          className="auth-page-input"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          className="auth-page-input"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-base auth-page-btn">Sign Up</button>
        <button className="btn-base auth-page-btn">Login</button>
      </form>
      <div className="login-image">
        <img src="src/assets/images/flamenco-camping.webp" alt="" />
      </div>
    </div>
  );
}

export default Playground;
