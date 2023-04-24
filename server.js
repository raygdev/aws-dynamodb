require("dotenv").config()
const { DynamoDBClient, CreateTableCommand, BatchWriteItemCommand} = require("@aws-sdk/client-dynamodb")


const client = new DynamoDBClient({})


let certificationTableParams = {
    AttributeDefinitions: [
        {
            AttributeName: "certification",
            AttributeType: "S"
        },

    ],
    KeySchema: [
        {
            AttributeName: "certification",
            KeyType: "HASH"
        },
    
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },

    TableName: "Certifications"
}

let studentTableParams = {
    AttributeDefinitions: [
        {
            AttributeName: "email",
            AttributeType: "S"
        },

    ],
    KeySchema: [
        {
            AttributeName: "email",
            KeyType: "HASH"
        },
    
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },

    TableName: "Students"
}

let writeCertsParams = {
    RequestItems: {
        Certifications: [
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Responsive Web Design"
                        },
                        name: {
                            "S": "Responsive Web Design"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "JavaScript Algorithms and Data Structures"
                        },
                        name: {
                            "S": "JavaScript Algorithms and Data Structures"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Front End Development Libraries"
                        },
                        name: {
                            "S": "Front End Development Libraries"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Data Visualization"
                        },
                        name: {
                            "S": "Data Visualization"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Relational Database"
                        },
                        name: {
                            "S": "Relational Database"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Back End Development and APIs"
                        },
                        name: {
                            "S": "Back End Development and APIs"
                        }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        certification: {
                            "S": "Quality Assurance"
                        },
                        name: {
                            "S": "Quality Assurance"
                        }
                    }
                }
            }
        ]
    }
}
async function create(){

    try{
        let data1 = await client.send(new CreateTableCommand(certificationTableParams))
        let data2 = await client.send(new CreateTableCommand(studentTableParams))
        console.log(`\nSuccess creating Certifications Table\nCreation Info:\n`, data1)
        console.log(`\n\nSuccess creating Students Table\nCreation Info:\n`, data2)
        
    } catch(e){
        console.log("failed to create table(s)\n",e)
    }
}


create().then(() => {
   setTimeout(async() => {
    try{
        let data3 = await client.send( new BatchWriteItemCommand(writeCertsParams))
        console.log("\n\n Successfully wrote to certifications table\n",data3)
    } catch(e){
        console.log("Something went wrong writing the cert data:\n\n",e)
    }
   }, 20000);
})

module.exports = client