import React, { useState, useEffect } from "react";
import Mainmodal from "./Mainmodal";
import Mymethods from "../Mymethods";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

//import $ from "jquery";
export default function Home() {
  const [data, setdata] = useState([]);
  const [openMsg, setOpenmsg] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const [searchTitle, setSearchTitle] = useState("");

  const initial_value = {
    id: null,
    Name: "",
    Address: "",
  };

  const [User, setUser] = useState(initial_value);

  const handleChangeEvent = (event) => {
    const { name, value } = event.target;
    setUser({ ...User, [name]: value });
  };

  const save = () => {
    // $.ajax({
    //   url: "http://localhost:3001/Users",
    //   method: "GET",
    //   success: function (response) {
    //     console.log(response);
    //     setdata(response);
    //   },
    //   error: function (response) {
    //     console.log("Error in fetch record!");
    //   },
    // });
    Mymethods.getAll()
      .then((res) => {
        console.log(res);
        setdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    save();
  }, []);

  const handleDelete = (id) => {
    Mymethods.remove(id)
      .then((res) => {
        save();
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const handleUpdate = (id) => {
    handleShow();
    Mymethods.get(id)
      .then((res) => {
        console.log(res);
        setUser({
          id: res.data.id,
          Name: res.data.Name,
          Address: res.data.Address,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateData = () => {
    var Newdata = {
      Name: User.Name,
      Address: User.Address,
    };

    Mymethods.update(User.id, Newdata)
      .then((res) => {
        console.log(res);
        handleClose();
        save();
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const findByTitle = () => {
    Mymethods.findByTitle(searchTitle)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          setOpenmsg(true);
          save();
        } else {
          setdata(response.data);
          setOpenmsg(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeAllTutorials = () => {
    setdata("");
    Mymethods.getAll()
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          Mymethods.remove(response.data[i].id).then((res) => {
            console.log(res);
          });
        }
      })
      .catch((e) => {
        console.log(e.data.errors);
      });
  };

  return (
    <>
      <div className="container">
        <div className="list row">
          <div className="col-md-12">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTitle}
                onChange={onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByTitle}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <Mainmodal dataRefresh={save} />
        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
        {openMsg && <div>Data not Found....</div>}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Click</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((val, index) => {
                return (
                  <tr key={index}>
                    <td>{val.id}</td>
                    <td>{val.Name}</td>
                    <td>{val.Address}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdate(val.id)}
                      >
                        Edit
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(val.id)}
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                placeholder="Enter Name"
                value={User.Name}
                onChange={handleChangeEvent}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="Address"
                placeholder="Enter Address"
                value={User.Address}
                onChange={handleChangeEvent}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={updateData}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
