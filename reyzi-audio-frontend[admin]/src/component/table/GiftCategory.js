import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getCategory, deleteCategory } from "../../store/giftCategory/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useHistory } from "react-router-dom";
// type
import { OPEN_CATEGORY_DIALOG } from "../../store/giftCategory/types";
// dialog
import GiftCategoryDialog from "../dialog/GiftCategory";
//sweet alert
import { alert, warning, permissionError } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";

const GiftCategoryTable = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    props.getCategory(); // eslint-disable-next-line
  }, []);

  const giftCategory = useSelector((state) => state.giftCategory.giftCategory);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    setData(giftCategory);
  }, [giftCategory]);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = giftCategory.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(giftCategory);
    }
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_CATEGORY_DIALOG });
  };

  const handleDelete = (categoryId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deleteCategory(categoryId);
          alert("Deleted!", `Category has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_CATEGORY_DIALOG, payload: data });
  };

  const openGifts = (data) => {
    localStorage.setItem("Category", JSON.stringify(data));
    history.push("/admin/giftCategory/gift");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Category</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Category
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="main-wrapper">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
            <button
              type="button"
              className="btn waves-effect waves-light btn-danger btn-sm float-left"
              onClick={handleOpen}
              id="bannerDialog"
            >
              <i className="fa fa-plus"></i>
              <span className="icon_margin">New</span>
            </button>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0">
            <form action="">
              <div className="input-group mb-3 border rounded-pill">
                <div className="input-group-prepend border-0">
                  <div id="button-addon4" className="btn text-danger">
                    <i className="fas fa-search mt-2"></i>
                  </div>
                </div>
                <input
                  type="search"
                  placeholder="What're you searching for?"
                  aria-describedby="button-addon4"
                  className="form-control bg-none border-0 rounded-pill searchBar"
                  style={{ background: "#181821" }}
                  onChange={handleSearch}
                />
              </div>
            </form>
          </div>
        </div>
        <div class="row">
          {data.length > 0 ? (
            data.map((data, index) => {
              return (
                <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" key={index}>
                  <div class="card contact-card card-bg pointer-cursor">
                    <div class="card-body text-center">
                      <img
                        src={data.image ? baseURL + data.image : noImage}
                        alt=""
                        draggable="false"
                        className="mx-auto shadow rounded-circle"
                        style={{
                          height: "100px",
                          width: "100px",
                          obejctFit: "cover",
                          display: "block",
                        }}
                        onClick={() => openGifts(data)}
                      />

                      <div
                        class="contact-card-info"
                        onClick={() => openGifts(data)}
                      >
                        <h6>{data.name}</h6>
                        <span>
                          {data.giftCount ? data.giftCount : "0"} Gifts
                        </span>
                      </div>
                      <div class="contact-card-buttons">
                        <button
                          type="button"
                          class="btn btn-circle btn-primary m-b-xs"
                          onClick={() => handleEdit(data)}
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          class="btn btn-circle btn-danger m-b-xs"
                          onClick={() => handleDelete(data._id)}
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" align="center">
                Nothing to show!!
              </td>
            </tr>
          )}
        </div>
      </div>
      <GiftCategoryDialog />
    </>
  );
};

export default connect(null, { getCategory, deleteCategory })(
  GiftCategoryTable
);
