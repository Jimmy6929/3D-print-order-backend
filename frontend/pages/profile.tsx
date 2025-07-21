import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'
import { Profile } from '../utils/supabase'

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: 'UK'
  })

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        full_name: user.profile.full_name || '',
        address_line_1: user.profile.address_line_1 || '',
        address_line_2: user.profile.address_line_2 || '',
        city: user.profile.city || '',
        postal_code: user.profile.postal_code || '',
        country: user.profile.country || 'UK'
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await updateProfile(formData)
    
    if (error) {
      setError(error.message || 'Failed to update profile')
    } else {
      setSuccess('Profile updated successfully!')
      setEditing(false)
    }
    
    setLoading(false)
  }

  const handleCancel = () => {
    // Reset form to original values
    if (user?.profile) {
      setFormData({
        full_name: user.profile.full_name || '',
        address_line_1: user.profile.address_line_1 || '',
        address_line_2: user.profile.address_line_2 || '',
        city: user.profile.city || '',
        postal_code: user.profile.postal_code || '',
        country: user.profile.country || 'UK'
      })
    }
    setEditing(false)
    setError(null)
    setSuccess(null)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-blue-100 mt-2">{user?.email}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Success/Error Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {success}
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address_line_1"
                        id="address_line_1"
                        value={formData.address_line_1}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Street address"
                      />
                    </div>

                    <div>
                      <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line_2"
                        id="address_line_2"
                        value={formData.address_line_2}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="UK">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">My Orders</h3>
              <p className="text-gray-600 mb-4">View and track your 3D printing orders</p>
              <a 
                href="/orders" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View Orders
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload File</h3>
              <p className="text-gray-600 mb-4">Start a new 3D printing order</p>
              <a 
                href="/#upload-section" 
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upload Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage 