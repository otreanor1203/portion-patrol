import {requests} from "../config/mongoCollections.js";
import { checkId } from "../helpers.js";

const exportedMethods = {
    async addRequest(userId, state, location, address) {
        try{
            userId = checkId(userId, "addRequest", "User ID");
        } catch (e) {
            throw e
        }
        if (typeof state !== "string") {
            throw {
                status: 400,
                function: "addRequest",
                error: "State must be a string.",
            };
        }
        if (typeof location !== "string") {
            throw {
                status: 400,
                function: "addRequest",
                error: "Location must be a string.",
            };
        }
        if (typeof address !== "string") {
            throw {
                status: 400,
                function: "addRequest",
                error: "Address must be a string.",
            };
        }

        const requestsCollection = await requests();
        const newRequest = {
            userId,
            state,
            location,
            address,
            status: "pending",
        };
        const result = await requestsCollection.insertOne(newRequest);
        return result;
    },

    async getAllRequests() {
        const requestsCollection = await requests();
        const allRequests = await requestsCollection.find({}).toArray();
        return allRequests;
    },

    async deleteRequest(requestId) {
        if (typeof requestId !== "string") {
            throw {
                status: 400,
                function: "deleteRequest",
                error: "Request ID must be a string.",
            };
        }
        const requestsCollection = await requests();
        const result = await requestsCollection.deleteOne({ _id: requestId });
        return result;
    },

    async getRequestById(requestId) {
        if (typeof requestId !== "string") {
            throw {
                status: 400,
                function: "getRequestById",
                error: "Request ID must be a string.",
            };
        }
        const requestsCollection = await requests();
        const request = await requestsCollection.findOne({ _id: requestId });
        return request;
    }

};

export default exportedMethods;