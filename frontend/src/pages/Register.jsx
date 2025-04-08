import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, UserPlus, Mail, User, Lock, Loader2, AtSign } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Send registration data without confirmPassword
    const { confirmPassword, ...userData } = formData;
    const result = await signUp(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  // Password strength indicators
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: 'bg-gray-300' };
    
    if (password.length < 6) {
      return { strength: 25, text: 'Weak', color: 'bg-red-500' };
    } else if (password.length < 10) {
      return { strength: 50, text: 'Medium', color: 'bg-yellow-500' };
    } else if (password.length < 12) {
      return { strength: 75, text: 'Good', color: 'bg-blue-500' };
    } else {
      return { strength: 100, text: 'Strong', color: 'bg-green-500' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 p-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.h2 
            className="text-center text-3xl font-extrabold text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Create Account
          </motion.h2>
          <p className="mt-2 text-center text-sm text-indigo-200">
            Join the community and start your journey
          </p>
        </motion.div>
        
        {error && (
          <motion.div 
            className="bg-red-400/30 backdrop-blur-sm border border-red-500 text-white px-4 py-3 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </motion.div>
        )}
        
        <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/30 bg-white/5 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AtSign className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/30 bg-white/5 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-white/30 bg-white/5 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-indigo-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-indigo-300" />
                  )}
                </button>
              </div>
              
              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                    <motion.div 
                      className={`h-2 rounded-full ${passwordStrength.color}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${passwordStrength.strength}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-indigo-300">{passwordStrength.text}</span>
                    <span className="text-xs text-indigo-300">
                      {formData.password.length < 6 ? `${6 - formData.password.length} more characters needed` : ''}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-red-500' 
                      : 'border-white/30'
                  } bg-white/5 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-indigo-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-indigo-300" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
              )}
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <UserPlus className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
                  </span>
                  Create Account
                </>
              )}
            </motion.button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-indigo-200">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-400 hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register; 