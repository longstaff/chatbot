/***************** CHANNELS *******************/

const createChannel = `CREATE TABLE IF NOT EXISTS channel(
    id VARCHAR(45) NOT NULL,
    name VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);`
export const channelInsert = `INSERT INTO channel(id, name) VALUES ($1, $2)`;
export const channelList = `SELECT * FROM channel`;
export const channelSearch = `SELECT * FROM channel WHERE id = $1`;

/***************** USERS *******************/

const createUser = `CREATE TABLE IF NOT EXISTS messageUser(
    id VARCHAR(45),
    name TEXT,
    PRIMARY KEY (id)
);`
export const userInsert = `INSERT INTO messageUser(id, name) VALUES ($1, $2)`;
export const userList = `SELECT * FROM messageUser`;
export const userSearch = `SELECT * FROM messageUser WHERE id = $1`;

/***************** LOGS *******************/

const createLog = `CREATE TABLE IF NOT EXISTS log(
    id VARCHAR(45),
    channelId VARCHAR(45),
    userId VARCHAR(45),
    message TEXT,
    timestamp VARCHAR(15),
    PRIMARY KEY (id),
    CONSTRAINT fk_channel
       FOREIGN KEY(channelId) 
       REFERENCES channel(id),
    CONSTRAINT fk_user
        FOREIGN KEY(userId) 
        REFERENCES messageUser(id)
);`
export const logInsert = `INSERT INTO log(id, channelId, userId, message, timestamp) VALUES ($1, $2, $3, $4, $5)`;
export const logList = `SELECT * FROM log WHERE channelId = $1 ORDER BY timestamp ASC`;
export const logSearch = `SELECT * FROM log WHERE channelId = $1 AND id = $2`;

/***************** INIT *******************/

export const initTables = `${createChannel}
${createUser}
${createLog}

INSERT INTO channel(id, name) VALUES ('1', 'channel 1'), ('2', 'channel 2'), ('3', 'channel 3') ON CONFLICT DO NOTHING;
`;