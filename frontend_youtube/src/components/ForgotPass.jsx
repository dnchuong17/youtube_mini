// PasswordReset.jsx
import React, { useState } from 'react';
import '../style/PasswordReset.css';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../api/authService.js';
import { toast } from 'react-toastify';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await forgotPassword({ email });
            if (response.status === 200) {
                toast.success('Please check your email!', { pauseOnHover: false });
                setStep(2);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong!');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('New Password and Confirm Password must be the same');
            return;
        }
        console.log({ email, code, newPassword });
        try {
            const response = await resetPassword({ email, code, newPassword });
            if (response.status === 200) {
                toast.success('Reset password successfully');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error || 'Failed to reset password', { pauseOnHover: false });
        }
    };

    return (
        <div className="form-gap">
            <div className="forgot-container">
                <div className="forgot-row">
                    <div className="form-forgot">
                        <div className="panel">
                            <div className="panel-body">
                                <div className="text-center">
                                    <h3>
                                        <i className="fa fa-lock"></i>
                                    </h3>

                                    {step === 1 && (
                                        <>
                                            <h2>Forgot Password?</h2>
                                            <p>You can reset your password here.</p>

                                            <form id="register-form" onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <div className="input-group">
                            <span className="input-group-addon">
                              <i className="fa fa-envelope"></i>
                            </span>
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            placeholder="Email address"
                                                            className="form-control"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <input
                                                        name="recover-submit"
                                                        className="btn btn-primary"
                                                        value="Reset Password"
                                                        type="submit"
                                                    />
                                                </div>
                                                <input type="hidden" className="hide" name="token" id="token" value="" />
                                            </form>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <h2>Enter Verification Code & Reset Password</h2>
                                            <p>Check your email for the reset password code.</p>

                                            <form onSubmit={handleResetPassword}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Verification Code"
                                                        className="form-control"
                                                        value={code}
                                                        onChange={(e) => setCode(e.target.value)}
                                                        required
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="New Password"
                                                        className="form-control"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm New Password"
                                                        className="form-control"
                                                        value={confirmNewPassword}
                                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button className="btn btn-primary" type="submit">
                                                    Reset Password
                                                </button>
                                            </form>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
