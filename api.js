const db = require("./server")
const {
    GetItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    PutItemCommand,
    ScanCommand
} = require("@aws-sdk/client-dynamodb")
const { marshall, unmarshall }  = require("@aws-sdk/util-dynamodb")


const getStudent = async (event) => {
    const response = { statusCode: 200 }

    try {
        const params = {
            TableName: process.env.DYNAMODB_STUDENT_TABLE_NAME,
            Key: marshall({studentId: event.pathParameters.studentId})
        }
        const { Item } = await db.send(new GetItemCommand(params))
        response.body = JSON.stringify({
            message: "Success",
            data: (Item) ? unmarshall(Item) : {} ,
            rawData: Item 
        })
    } catch(e) {
        console.log(e)
        response.statusCode = 500
        response.body = JSON.stringify({
            message: "Something went wrong getting the student",
            errorMsg: e.message,
            errorStack: e.stack
        })
    }
    return response
}

const createStudent = async (event) => {
    const response = { statusCode: 200 }

    try {
        const body = JSON.parse(event.body)
        const params = {
            TableName: process.env.DYNAMODB_STUDENT_TABLE_NAME,
            Item: marshall(body || {})
        }
        const createStudent = await db.send(new PutItemCommand(params))
        response.body = JSON.stringify({
            message: "Successfully created the student",
            createStudent
        })

    } catch(e) {
        console.log(e)
        response.statusCode = 500
        response.body = JSON.stringify({
            message: "Failed to create the student",
            errorMsg: e.message,
            errorStack: e.stack
        })
    }
    return response
}

const updateStudent = async (event) => {
    const response = { statusCode: 200 }
    
    try {
        const body = JSON.parse(event.body)
        const objKeys = Object.keys(body)
        const params = {
            TableName: process.env.DYNAMODB_STUDENT_TABLE_NAME,
            Key: marshall({ studentId: event.pathParameters.studentId}),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`] : body[key]
            }), {}))
        }
        const updateResult = await db.send(new UpdateItemCommand(params))
        response.body = JSON.stringify({
            message: "Successfully updated the student",
            updateResult
        })

    } catch(e) {
        response.statusCode = 500
        response.body = JSON.stringify({
            message: "Failed to update the student",
            errorMsg: e.message,
            errorStack: e.stack
        })
    }
    return response
}

const deleteStudent = async (event) => {
    const response = { statusCode: 200 }
    
    try {
        const params = {
            TableName: process.env.DYNAMODB_STUDENT_TABLE_NAME,
            Key: marshall({studentId : event.pathParameters.studentId})
        }
        const deletedStudent = await db.send(new DeleteItemCommand(params))
        response.body = JSON.stringify({
            message: "Successfully deleted the student",
            deletedStudent
        })
    } catch(e) {
        console.log(e)
        response.statusCode = 500
        response.body = JSON.stringify({
            message: "Failed to delete the user",
            errorMsg: e.message,
            errorStack: e.stack
        })
    }
    return response
}

const getAllStudents = async (event) => {
    const response = { statusCode: 200 }

    try {
        const { Items } = await db.send(new ScanCommand({ TableName: process.env.DYNAMODB_STUDENT_TABLE_NAME}))
        response.body = JSON.stringify({
            message: "Successfully retrieved all students",
            data: (Items) ? Items.map(item => unmarshall(item)) : {},
            rawData: Items
        })
    } catch(e) {
        response.statusCode = 500
        response.body = JSON.stringify({
            message: "Failed to get students",
            errorMsg: e.message,
            errorStack: e.stack
        })
    }
    return response
}

module.exports = {
    getStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
    createStudent
}