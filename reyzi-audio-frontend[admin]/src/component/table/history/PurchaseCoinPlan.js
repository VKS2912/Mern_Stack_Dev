import React from "react";

const PurchaseCoinPlan = (props) => {
  return (
    <table class="table table-striped mt-5">
      <thead>
        <tr>
          <th>No.</th>
          <th>User Name</th>
          <th>Diamond</th>
          <th>Dollar</th>
          <th>Rupee</th>
          <th>Payment Gateway</th>
          <th>Purchase Date</th>
        </tr>
      </thead>
      <tbody>
        {props.data?.length > 0 ? (
          props.data.map((data, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td className="text-primary">{data.diamond}</td>
                <td className="text-info">{data.dollar}</td>
                <td className="text-success">{data.rupee}</td>
                <td className="text-danger">{data.paymentGateway}</td>
                <td>{data.purchaseDate}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="7" align="center">
              Nothing to show!!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PurchaseCoinPlan;
