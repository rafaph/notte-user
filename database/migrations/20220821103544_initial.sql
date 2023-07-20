-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users
(
  id        char(36)     NOT NULL,
  firstName varchar(100) NOT NULL,
  lastName  varchar(100) NOT NULL,
  email     varchar(320) NOT NULL,
  password  varchar(255) NOT NULL,
  createdAt timestamp    NOT NULL,
  updatedAt timestamp    NOT NULL,
  CONSTRAINT users_unique_email UNIQUE (email),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
