-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id character(36) NOT NULL,
  email character varying(320) NOT NULL,
  password character varying(255) NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  CONSTRAINT users_unique_email UNIQUE (email),
  CONSTRAINT users_pk PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS notes
(
  id character(36) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "userId" character(36) NOT NULL,
  CONSTRAINT notes_pk PRIMARY KEY (id),
  CONSTRAINT notes_users_fk FOREIGN KEY ("userId")
  REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table notes;
drop table users;
-- +goose StatementEnd
