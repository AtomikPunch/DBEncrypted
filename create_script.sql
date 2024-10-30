PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE User (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nom TEXT NOT NULL,
            Prenom TEXT NOT NULL,
            Role TEXT NOT NULL
        );
INSERT INTO User VALUES(1,'Doe','John','Admin');
INSERT INTO User VALUES(2,'Brown','Michael','User');
INSERT INTO User VALUES(3,'Johnson','Emily','User');
INSERT INTO User VALUES(4,'Williams','David','User');
INSERT INTO User VALUES(5,'Smith','Jane','User');
CREATE TABLE Weather (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Temperature REAL NOT NULL,
            Humidity REAL NOT NULL
        );
INSERT INTO Weather VALUES(1,294.23000000000003595,73.0);
INSERT INTO Weather VALUES(2,294.23000000000003595,73.0);
INSERT INTO Weather VALUES(3,294.23000000000003595,73.0);
INSERT INTO Weather VALUES(4,294.23000000000003595,73.0);
INSERT INTO Weather VALUES(5,294.23000000000003595,73.0);
INSERT INTO Weather VALUES(6,294.23000000000003595,73.0);
CREATE TABLE Alarms (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            AlarmType TEXT NOT NULL,
            DoorID INTEGER,
            DoorActualState TEXT,
            Date DATE NOT NULL,
            Time TIME NOT NULL,
            Field TEXT,
            FOREIGN KEY (DoorID) REFERENCES Doors(ID)
        );
CREATE TABLE Doors (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Status TEXT NOT NULL CHECK (Status IN ('Locked', 'Unlocked')),
            Location TEXT NOT NULL,
            IsDisabled INTEGER DEFAULT 0,
            AllowedRoles TEXT NOT NULL
        );
INSERT INTO Doors VALUES(1,'Locked','Back Entrance',0,'Admin');
INSERT INTO Doors VALUES(2,'Unlocked','Main Entrance',0,'Admin,User');
CREATE TABLE AccessLogs (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Timestamp DATETIME NOT NULL,       -- Changed to a single DATETIME column
            UserID INTEGER,
            DoorID INTEGER,
            AccessStatus TEXT NOT NULL,
            FOREIGN KEY (UserID) REFERENCES User(ID),
            FOREIGN KEY (DoorID) REFERENCES Doors(ID)
        );
INSERT INTO AccessLogs VALUES(1,'2024-10-29T19:49:35.415Z',1,2,'Unauthorized');
INSERT INTO AccessLogs VALUES(2,'2024-10-29T19:49:57.059Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(3,'2024-10-29T19:50:32.975Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(4,'2024-10-29T19:57:53.997Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(5,'2024-10-29T20:02:09.458Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(6,'2024-10-29T20:04:02.517Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(7,'2024-10-29T20:36:02.706Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(8,'2024-10-29T20:37:18.555Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(9,'2024-10-29T20:37:18.561Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(10,'2024-10-29T20:37:18.561Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(11,'2024-10-29T20:37:18.561Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(12,'2024-10-29T20:37:18.562Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(13,'2024-10-30T03:25:31.192Z',1,2,'Authorized');
INSERT INTO AccessLogs VALUES(14,'2024-10-30T03:25:31.202Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(15,'2024-10-30T03:25:31.202Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(16,'2024-10-30T03:25:31.202Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(17,'2024-10-30T03:25:31.204Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(18,'2024-10-30T03:29:27.938Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(19,'2024-10-30T03:29:27.944Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(20,'2024-10-30T03:29:27.945Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(21,'2024-10-30T03:29:27.945Z',1,1,'Authorized');
INSERT INTO AccessLogs VALUES(22,'2024-10-30T03:29:27.946Z',1,2,'Authorized');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('AccessLogs',22);
INSERT INTO sqlite_sequence VALUES('Weather',6);
INSERT INTO sqlite_sequence VALUES('User',5);
INSERT INTO sqlite_sequence VALUES('Doors',2);
COMMIT;
