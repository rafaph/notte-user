-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id character(36) NOT NULL,
  "firstName" character varying(100) NOT NULL,
  "lastName" character varying(100) NOT NULL,
  email character varying(320) NOT NULL,
  password character varying(255) NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  CONSTRAINT users_unique_email UNIQUE (email),
  CONSTRAINT users_pk PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table users;
-- +goose StatementEnd
