import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Input from '../../components/input/Input.jsx';
import Textarea from '../../components/textarea/Textarea.jsx';
import Button from '../../components/button/Button.jsx';
import logo from '../../assets/Icons/AppLogo-Registration.svg';
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
    <div className="auth-page">
      <div className="auth-branding">
        <img src={logo} alt="HelpingHand logo" className="auth-logo" />
        <h1 className="auth-title">HelpingHand</h1>
        <p className="auth-tagline">Don't just stand, give a hand!</p>
      </div>

      <div className="auth-forms-panel">
        <div className="auth-card">
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <Input
              label="Username"
              type="text"
              register={registerLogin("username", {
                required: "Username is required",
                minLength: { value: 6, message: "Username must be at least 6 characters" },
              })}
              error={loginErrors.username}
            />
            <Input
              label="Password"
              type="password"
              register={registerLogin("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              error={loginErrors.password}
            />
            <Button type="submit" variant="secondary">Login</Button>
          </form>

          <hr className="auth-divider" />

          <h2>New with us? Create an account!</h2>
          <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
            <Input
              label="Username"
              type="text"
              register={registerSignup("username", {
                required: "Username is required",
                minLength: { value: 6, message: "Username must be at least 6 characters" },
              })}
              error={signupErrors.username}
            />
            <Input
              label="Email"
              type="email"
              register={registerSignup("email", {
                required: "Email is required",
              })}
              error={signupErrors.email}
            />
            <Input
              label="Password"
              type="password"
              register={registerSignup("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              error={signupErrors.password}
            />
            <Input
              label="Age"
              type="number"
              register={registerSignup("age", {
                required: "Age is required",
                min: { value: 18, message: "You must be at least 18 years old" },
                max: { value: 150, message: "Age must be 150 or below" },
              })}
              error={signupErrors.age}
            />
            <Input
              label="Location"
              type="text"
              register={registerSignup("location")}
              error={signupErrors.location}
            />
            <Textarea
              label="Things I can help with"
              register={registerSignup("competencies")}
              error={signupErrors.competencies}
              rows={2}
            />
            <Button type="submit" variant="secondary">Register</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginRegistration;
