import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Image } from "react-bootstrap";
import { getUserProfile, updateUserProfile } from "../api/fetchApi";
import { toast } from "react-hot-toast";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    profile_picture: null,
  });

  const headers = {
    Authorization: `Token ${sessionStorage.getItem("token")}`,
  };

  useEffect(() => {
    getUserProfile(headers)
      .then((res) => {
        setProfile(res.data);
        setFormData({
          phone: res.data.phone || "",
          address: res.data.address || "",
          profile_picture: null,
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch profile data!");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleRemovePicture = () => {
    setFormData({ ...formData, profile_picture: null });
    toast.success("Profile picture removed");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedForm = new FormData();
    updatedForm.append("phone", formData.phone);
    updatedForm.append("address", formData.address);
    if (formData.profile_picture !== null) {
      updatedForm.append("profile_picture", formData.profile_picture);
    } else {
      updatedForm.append("profile_picture", "");
    }

    const multipartHeaders = {
      Authorization: `Token ${sessionStorage.getItem("token")}`,
    };

    updateUserProfile(updatedForm, multipartHeaders)
      .then((res) => {
        setProfile(res.data);
        toast.success("Profile updated successfully!");
        setEditMode(false);
      })
      .catch((err) => {
        toast.error("Failed to update profile!");
        console.error(err);
      });
  };

  return (
    <Container className="mt-5">
      <h2>User Profile</h2>
      {profile ? (
        <Card className="p-4">
          <Card.Body>
            <div className="mb-3">
              <Image
                src={`http://127.0.0.1:8000${profile.profile_picture}`}
                roundedCircle
                width="100"
                height="100"
                alt="Null"
              />
            </div>

            <Card.Title>{profile.username}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {profile.email}
            </Card.Text>

            {editMode ? (
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="file"
                      name="profile_picture"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ maxWidth: "250px" }}
                    />
                    {(profile.profile_picture || formData.profile_picture) && (
                      <i
                        className="fa fa-trash text-danger ms-2"
                        style={{ cursor: "pointer", fontSize: "1.3rem" }}
                        onClick={handleRemovePicture}
                        title="Delete picture"
                      ></i>
                    )}
                  </div>
                </Form.Group>

                <Button variant="success" type="submit">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <>
                <Card.Text>
                  <strong>Phone:</strong> {profile.phone || "Not provided"}
                </Card.Text>
                <Card.Text>
                  <strong>Address:</strong> {profile.address || "Not provided"}
                </Card.Text>
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        <p>Loading profile...</p>
      )}
    </Container>
  );
}

export default UserProfile;
