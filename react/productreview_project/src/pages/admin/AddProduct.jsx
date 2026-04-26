import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { addProduct, listCategories } from "../../api/fetchApi";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AdminContext } from "../../AdminContextApi";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    price: "",
    image: null,
    category: "",
  });

  const { setAdminProducts } = useContext(AdminContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const headers = {
    Authorization: `token ${sessionStorage.getItem("token")}`,
  };

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

    if (!product_name || !description || !price || !image || !category) {
      toast("Invalid Input!");
    } else {
      const formData = new FormData();
      formData.append("product_name", product_name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("category", category);

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };

      addProduct(formData, headers)
        .then((res) => {
          console.log(res.data);
          setAdminProducts(res);
          toast.success("Product Added!");
          handleClose();
        })
        .catch((err) => {
          console.error("Error adding product:", err);
          toast("Error adding product!");
        });
    }
  };
  return (
    <div>
      <a
        href="#"
        className="text-white navbar-brand"
        style={{ fontSize: "small" }}
        onClick={handleShow}
      >
        Add Product
      </a>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
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
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingDescription"
            label="Description"
            className="mb-3"
          >
            <Form.Control
              as="textarea" rows={4}
              placeholder="Enter description..."
              onChange={(e) => {
                setProduct({ ...product, description: e.target.value });
              }}
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

export default AddProduct;
