import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {
  getAdminProduct,
  editProduct,
  listCategories,
} from "../../api/fetchApi";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AdminContext } from "../../AdminContextApi";

function EditProduct({ id }) {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
    category: "",
  });

  const { setAdminProducts } = useContext(AdminContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const headers = {
    Authorization: `token ${sessionStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchCategories();
    getAdminProduct(id, headers)
      .then((res) => {
        setProduct({ ...res.data, image: null, imagePreview: res.data.image });
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const fetchCategories = () => {
    listCategories(headers)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories", err);
      });
  };

  const formSubmit = () => {
    const { product_name, description, price, image, category } = product;

    if (!product_name || !description || !price || !category) {
      toast("Invalid Input!");
    } else {
      const formData = new FormData();
      formData.append("product_name", product_name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };

      editProduct(id, formData, headers)
        .then((res) => {
          console.log(res.data);
          setAdminProducts(res.data);
          toast.success("Product Updated!");
          handleClose();
        })
        .catch((err) => {
          console.error("Error updating product:", err);
          console.log(err.response?.data);
          toast("Error updating product!");
        });
    }
  };
  return (
    <div>
      <button className="btn btn-success btn-sm" onClick={handleShow}>
        Edit
      </button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingName"
            label="Product Name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Enter Name"
              onChange={(e) => {
                setProduct({ ...product, product_name: e.target.value });
              }}
              value={product.product_name}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingDescription"
            label="Description"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Edit description.."
              onChange={(e) => {
                setProduct({ ...product, description: e.target.value });
              }}
              value={product.description}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingPrice"
            label="Price"
            className="mb-3"
          >
            <Form.Control
              type="number"
              placeholder="KL 10 A 1010"
              onChange={(e) => {
                setProduct({ ...product, price: e.target.value });
              }}
              value={product.price}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingCategory"
            label="category"
            className="mb-3"
          >
            <Form.Select
              onChange={(e) => {
                setProduct({ ...product, category: e.target.value });
              }}
              value={product.category}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                setProduct({ ...product, image: e.target.files[0] });
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={formSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditProduct;
