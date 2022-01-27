import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';

export default class UploadFloorMap extends Component {
   constructor(props) {
      super(props);
      this.state = {
         floorName: "",
         width: "",
         height: "",
         image: null,
         imagePreviewUrl: null,
         message: "",
         success: false,
         error: false,
      }
   }

   inputHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value })
   }

   handleImage = (e) => {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
         this.setState({
            image: file,
            imagePreviewUrl: reader.result,
         });
      };
      reader.readAsDataURL(file);
   }

   registerFloorMap = (e) => {
      e.preventDefault();
      console.log('Register FloorMap Function Called');
   }

   render() {
      let { imagePreviewUrl } = this.state;
      let $imagePreview = null;
      if (imagePreviewUrl) {
         $imagePreview = <img alt="" src={imagePreviewUrl} style={{
            width: '75vw',
            height: '20vw',
         }} />;
      }
      // console.log('imagePreview------>', $imagePreview);
      const { floorName, width, height, message, success, error } = this.state;
      return (
         <Fragment>
            {error && (
               <div className="alert alert-danger">
                  <strong className={common.message}>Error!   {message} </strong>
               </div>
            )}
            {success && (
               <div className="alert alert-success">
                  <strong className={common.message}>Success!   {message}</strong>
               </div>
            )}
            <p className={common.header}>Upload FloorMap</p>

            <form className="container mt-2"
               onSubmit={this.registerFloorMap}>
               <div className="row">
                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">FloorName *</label>
                     <input type="text"
                        value={floorName}
                        name="floorName"
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Width *</label>
                     <input type="number"
                        value={width}
                        name="width"
                        step="any"
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Height *</label>
                     <input type="text"
                        value={height}
                        name="height"
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Floor Image*</label>
                     <input type="file"
                        accept="image/*"
                        name="image"
                        id="image"
                        onChange={this.handleImage}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>
               </div>


               <div className="text-center">
                  <input type="submit"
                     value="Upload Floormap"
                     className={"btn btn-primary " + common.button} />
               </div>

               <div className="text-center mt-4">{$imagePreview}</div>
            </form>
         </Fragment>
      )
   }
}
