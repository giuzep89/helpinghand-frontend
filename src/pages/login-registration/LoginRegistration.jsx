import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Input from '../../components/input/Input.jsx';
import Button from '../../components/button/Button.jsx';
import './LoginRegistration.css';

function LoginRegistration() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm();

  function onLoginSubmit(data) {
    login(data.username);
    navigate("/");
  }

  function onSignupSubmit() {
    // TODO: implement real registration logic
    navigate("/");
  }

  return (
    <div className="login-registration">
      <h1>Login / Registration</h1>

      <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
        <h2>Login</h2>
        <Input
          label="Username"
          type="text"
          id="login-username"
          register={registerLogin("username", {
            required: "Username is required",
            minLength: { value: 6, message: "Username must be at least 6 characters" },
          })}
          error={loginErrors.username}
        />
        <Input
          label="Password"
          type="password"
          id="login-password"
          register={registerLogin("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
          error={loginErrors.password}
        />
        <Button type="submit">Login</Button>
      </form>

      <hr />

      <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
        <h2>Registration</h2>
        <Input
          label="Username"
          type="text"
          id="signup-username"
          register={registerSignup("username", {
            required: "Username is required",
            minLength: { value: 6, message: "Username must be at least 6 characters" },
          })}
          error={signupErrors.username}
        />
        <Input
          label="Email"
          type="email"
          id="signup-email"
          register={registerSignup("email", {
            required: "Email is required",
          })}
          error={signupErrors.email}
        />
        <Input
          label="Password"
          type="password"
          id="signup-password"
          register={registerSignup("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
          error={signupErrors.password}
        />
        <Input
          label="Age"
          type="number"
          id="signup-age"
          register={registerSignup("age", {
            required: "Age is required",
            min: { value: 18, message: "You must be at least 18 years old" },
            max: { value: 150, message: "Age must be 150 or below" },
          })}
          error={signupErrors.age}
        />

        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}

export default LoginRegistration;
