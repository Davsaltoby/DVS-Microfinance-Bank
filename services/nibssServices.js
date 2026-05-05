import { get } from "mongoose";
import { nibssClient } from "./nibssClient.js";

const createAccountNibss = async ({ kycType, kycID, dob }) => {
  try {
    const res = await nibssClient.post("/api/account/create", {
      kycType,
      kycID,
      dob,
    });

    return res.data;
  } catch (err) {
    console.log(err.response?.data || err);
    throw new Error(err.response?.data.message);
  }
};

const getAllAccountsNibss = async () => {
  try {
    const accounts = await nibssClient.get("/api/accounts");
    return accounts.data;
    // console.log(accounts.data);
  } catch (error) {
    console.error(error.response?.data);
    throw new Error(error.response?.data.message);
  }
};

const nameEnquiryNibss = async ({ accountNumber }) => {
  try {
    const res = await nibssClient.get(
      `/api/account/name-enquiry/${accountNumber}`,
    );

    return res.data;
  } catch (error) {
    console.error("Error:", error);

    const status = error.response?.status;

    if (status === 404) {
      throw new Error("account not found");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

const transferNibss = async ({ from, to, amount }) => {
  try {
    const res = await nibssClient.post("/api/transfer", {
      from,
      to,
      amount,
    });

    return res.data;
  } catch (error) {
    console.error("Error:", error);

    // const status = error.response?.status;

    throw new Error(error.response?.data?.message || error.message);
  }
};

const accountBalanceEnquiryNibss = async (accountNumber) => {
  try {
    const res = await nibssClient.get(`/api/account/balance/${accountNumber}`);
    return res.data;
  } catch (err) {
    console.error(err.response?.data);
    throw new Error(err.response?.data?.message || err.message);
  }
};

const transactionStatusEnquiryNibss = async (transactionId) => {
  try {
    const res = await nibssClient.get(`/api/transaction/${transactionId}`);
    return res.data;
  } catch (err) {
    console.error(err.response?.data);
    throw new Error(err.response?.data?.message || err.message);
  }
};

export {
  createAccountNibss,
  getAllAccountsNibss,
  nameEnquiryNibss,
  transferNibss,
  accountBalanceEnquiryNibss,
  transactionStatusEnquiryNibss,
};
