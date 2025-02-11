import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    profile_picture: '',
  });
  const [newProfilePicture, setNewProfilePicture] = useState(''); // Store temporarily
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('users')
      .select('full_name, phone_number, address, profile_picture')
      .eq('id', user?.id)
      .single();

    if (error) {
      setErrorMessage('Failed to fetch profile.');
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data);
      setNewProfilePicture(data.profile_picture || ''); // Set new profile picture state
    }

    setLoading(false);
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const filePath = `profile_pictures/${user?.id}_${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      setErrorMessage('Failed to upload profile picture.');
      console.error('Upload Error:', error);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(filePath);

    setNewProfilePicture(publicUrlData.publicUrl); // Temporarily store new picture
    setUploading(false);
  };

  const handleRemovePicture = async () => {
    setNewProfilePicture(''); // Reset image but don’t update DB yet
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('users')
      .update({
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        address: profile.address,
        profile_picture: newProfilePicture, // Save profile picture only when clicked "Save"
      })
      .eq('id', user?.id);

    if (error) {
      setErrorMessage('Failed to update profile.');
    } else {
      setProfile((prev) => ({ ...prev, profile_picture: newProfilePicture })); // Update state
      alert('Profile updated successfully!');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center relative">
            <div
              className="relative cursor-pointer"
              onClick={() => setShowOptions(!showOptions)}
            >
              <img
                src={newProfilePicture || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <div className="absolute bottom-0 left-0 w-full text-center text-xs bg-black text-white bg-opacity-50 py-1 rounded-b-lg">
                {uploading ? 'Uploading...' : 'Change Picture'}
              </div>
            </div>

            {/* Dropdown Options */}
            {showOptions && (
              <div className="absolute top-28 bg-white border shadow-md rounded-lg w-48 p-2">
                <label className="block cursor-pointer text-gray-700 hover:bg-gray-100 p-2 rounded">
                  Upload Picture
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="w-full text-left text-red-600 hover:bg-gray-100 p-2 rounded"
                >
                  Remove Picture
                </button>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              value={profile.phone_number || ''}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Shipping Address */}
          <div>
            <label>Shipping Address</label>
            <input
              type="text"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-purple-600 text-white rounded-lg"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;


