import React, { useEffect, useState } from "react";

// routing
import { Link, useHistory } from "react-router-dom";

// action
import { createNewSong, editSong } from "../../store/song/action"

// redux
import { connect, useSelector } from "react-redux";
import { baseURL } from "../../util/Config";

import { permissionError } from "../../util/Alert";

const SongPage = (props) => {

  const history = useHistory();

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [title, setTitle] = useState("");
  const [singer, setSinger] = useState("");
  const [song, setSong] = useState(null);
  const [selectSong, setSelectSong] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    image: "",
    title: "",
    singer: "",
    song: ""
  });

  const dialogData = JSON.parse(localStorage.getItem("SongDetail"));

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setSinger(dialogData.singer);
      setSong(baseURL + dialogData.song);
      setTitle(dialogData.title)
      setImagePath(baseURL + dialogData.image);
    }// eslint-disable-next-line
  }, []);

  useEffect(
    () => () => {
      setError({
        image: "",
        title: "",
        singer: "",
        song: ""
      });
      setMongoId("");
      setTitle("");
      setSinger("");
      setSong(null);
      setImageData(null);
      setImagePath(null);
    },
    []
  );


  
  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!singer || !title || !song) {
      const errors = {};
      if (!singer) errors.singer = "Singer Detail is required!";
      if (!title) errors.title = "Song Title is required!";
      if (!song) errors.song = "Song is required!";
      if (!imageData || !imagePath) errors.image = "Please select an Image!";

      return setError({ ...errors })
    }
    if (!mongoId) {
      if (!imageData || !imagePath || !song?.type?.includes("audio") || !imageData?.type?.includes("image")) {
        const errors = {}
        if (!imageData?.type?.includes("image")) errors.image = "Please select valid image!"
        if (!song?.type?.includes("audio")) errors.song = "Please select valid audio!"
        if (!imageData || !imagePath) errors.image = "Please select an Image!";

        return setError({ ...errors });
      }
    } else {
      if ((!imageData && !imagePath) || (selectSong && !song?.type?.includes("audio")) || (!imageData?.type?.includes("image") && !imagePath)) {
        const errors = {}
        if (!imageData?.type?.includes("image") && !imagePath) errors.image = "Please select valid image!"
        if (selectSong && !song?.type?.includes("audio")) errors.song = "Please select valid audio!"
        if (!imageData && !imagePath) errors.image = "Please select an Image!";

        return setError({ ...errors });
      }
    }

    if (!hasPermission) return permissionError();

    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("song", song);
    formData.append("singer", singer);
    formData.append("title", title);
    if (mongoId) {
      props.editSong(formData, mongoId);
    } else {
      props.createNewSong(formData);
    }
    setTimeout(() => {
      history.push("/admin/song");
    }, 2000)
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light">Song Dialog</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin/song" className="text-danger">Song</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dialog
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4">
              </div>

              <form>

                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Song Title</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Tum se hai - Sadak"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          title: "Song Title is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          title: "",
                        });
                      }
                    }}
                  />
                  {errors.title && (
                    <div className="ml-2 mt-1">
                      {errors.title && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.title}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group mt-4">
                  <label className="text-gray mb-2">Singer Detail</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Ankit Tiwari"
                    value={singer}
                    onChange={(e) => {
                      setSinger(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          singer: "Singer Detail is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          singer: "",
                        });
                      }
                    }}
                  />
                  {errors.singer && (
                    <div className="ml-2 mt-1">
                      {errors.singer && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.singer}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className={`${mongoId && !selectSong ? "col-md-6" : "col-md-12"}`} >
                    <div className="form-group mt-4">
                      <label className="text-gray mb-2">Song</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        required=""
                        placeholder="Ankit Tiwari"
                        accept="audio/mp3,audio/*"
                        onChange={(e) => { setSong(e.target.files[0]); mongoId && setSelectSong(true) }}
                      />

                      {errors.song && (
                        <div className="ml-2 mt-1">
                          {errors.song && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.song}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${mongoId && !selectSong ? "col-md-6 mt-4 pt-3" : "col-md-12"}`} >
                    {
                      mongoId && !selectSong && <audio controls className="mt-3" style={{ height: 42 }}>
                        <source src={song} type="audio/ogg" />
                      </audio>
                    }
                  </div>
                </div>


                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Song Image</label>
                  <input
                    type="file"
                    id="image"
                    className="form-control"
                    accept="image/*"
                    required=""
                    hidden
                    onChange={HandleInputImage}
                  />
                  <div className="row">
                    <div className="col-md-3 pointer-cursor" style={{
                      height: 100,
                      width: 100,
                      border: "2px dashed gray",
                      textAlign: "center",
                      margin: 10
                    }}
                      onClick={() => document.getElementById("image").click()}
                    >
                      <i
                        className="fas fa-plus"
                        style={{ paddingTop: 20, fontSize: 60 }}
                      ></i>
                    </div>
                    <div className="col-md-9">{imagePath && (
                      <>
                        <img
                          height="80px"
                          width="80px"
                          alt="app"
                          src={imagePath}
                          style={{
                            boxShadow: "0 5px 15px 0 rgb(105 103 103 / 30%)",
                            border: "2px solid #fff",
                            borderRadius: 10,
                            marginTop: 10,
                            float: "left",
                            objectFit: "cover"
                          }}
                        />
                      </>
                    )}</div>
                  </div>
                  {errors.image && (
                    <div className="ml-2 mt-1">
                      {errors.image && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>



                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={() => { localStorage.removeItem("SongDetail"); history.push("/admin/song") }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default connect(null, { createNewSong, editSong })(SongPage);
