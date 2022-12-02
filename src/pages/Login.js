import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";
const LOGIN_URL = "/users/login";

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  console.log(auth);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   emailRef.current.focus();
  // }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          //   withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response));
      const accessToken = response?.data.token;
      //   const roles = response?.data?.roles;
      setAuth({ email, accessToken });
      setEmail("");
      setPwd("");
      setSuccess(true);
      navigate("/boards");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setAuth({});
  };

  return (
    <>
      {auth.email ? (
        <section>
          <h3>You are logged in as {auth.email}</h3>
          <button onClick={handleLogout}>Logout</button>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <Link to={"/register"}>Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
