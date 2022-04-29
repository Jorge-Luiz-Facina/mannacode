create extension "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.user (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_fk SERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT null,
    role TEXT NOT null,
    type TEXT NOT null,
    news_info boolean NOT NULL DEFAULT false,
    verify_token text,
    verified_email boolean not null default false,
    new_password_token text, 
    new_password_date TIMESTAMP,
    UNIQUE (id_fk)
);

CREATE TABLE IF NOT EXISTS public.plan (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    validity TIMESTAMP not null,
    started TIMESTAMP DEFAULT NOW() not null,
    number_players integer not null,
    online_rooms integer,
    active BOOLEAN NOT null default true,
    value float default 0.00,
    user_id INT4 NOT NULL
);

ALTER TABLE
    public.plan
ADD
    CONSTRAINT plan_user_fk FOREIGN KEY (user_id) REFERENCES public.user(id_fk);

CREATE TABLE IF NOT EXISTS public.group_challenge (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    view_code_name BOOLEAN NOT null default false,
    classification_length integer,
    score_evaluation TEXT,
    applicator_weight integer,
    player_weight integer,
    time_player_weight integer NOT null default 0,
    user_id INT4 NOT NULL,
    validity TIMESTAMP,
    mode text not null,
    status TEXT,
    type text not null,
    view_players_finished_challenge boolean
);

ALTER TABLE
    public.group_challenge
ADD
    CONSTRAINT group_challenge_user_fk FOREIGN KEY (user_id) REFERENCES public.user(id_fk);

CREATE TABLE IF NOT EXISTS public.challenge (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    index INTEGER not null,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    code text,
    language TEXT NOT NULL,
    test TEXT NOT NULL,
    time integer NOT NULL,
    group_challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.challenge
ADD
    CONSTRAINT challenge_group_challenge_fk FOREIGN KEY (group_challenge_id) REFERENCES public.group_challenge(id);

CREATE TABLE IF NOT EXISTS public.applicator_start (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    status text not null,
    type text not null,
    classification_length integer,
    user_id INT4 NOT NULL
);

ALTER TABLE
    public.applicator_start
ADD
    CONSTRAINT applicator_start_user_fk FOREIGN KEY (user_id) REFERENCES public.user(id_fk);

CREATE TABLE IF NOT EXISTS public.applicator_start_group_challenge (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    applicator_start_id  INT4 NOT NULL,
    group_challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.applicator_start_group_challenge
ADD
    CONSTRAINT applicator_start_group_challenge_and_group_challenge_fk FOREIGN KEY (group_challenge_id) REFERENCES public.group_challenge(id);
   
   
ALTER TABLE
    public.applicator_start_group_challenge
ADD
    CONSTRAINT applicator_start_group_challenge_andapplicator_start_fk FOREIGN KEY (applicator_start_id) REFERENCES public.applicator_start(id);


CREATE TABLE IF NOT EXISTS public.player_start (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_fk SERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    key_online uuid DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    applicator_start_id INT4 NOT NULL,
    key TEXT NOT NULL,
    status text NOT null,
    UNIQUE (id_fk)
);

ALTER TABLE
    public.player_start
ADD
    CONSTRAINT player_start_applicator_start_fk FOREIGN KEY (applicator_start_id) REFERENCES public.applicator_start(id);

CREATE TABLE IF NOT EXISTS public.player_challenge (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    code TEXT NOT NULL,
    error_log TEXT NOT NULL,
    time integer NOT null,
    started TIMESTAMP,
    pass_test boolean not null,
    player_start_id INT4 NOT NULL,
    punctuated boolean not null default false,
    challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.player_challenge
ADD
    CONSTRAINT player_challenge_player_start_fk FOREIGN KEY (player_start_id) REFERENCES public.player_start(id_fk);

ALTER TABLE
    public.player_challenge
ADD
    CONSTRAINT player_challenge_challenge_fk FOREIGN KEY (challenge_id) REFERENCES public.challenge(id);

CREATE TABLE IF NOT EXISTS public.player_challenge_punctuation (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    punctuation integer not null default 0,
    player_start_id INT4 NOT NULL,
    player_start_punctuated_id INT4 NOT NULL,
    player_challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.player_challenge_punctuation
ADD
    CONSTRAINT player_challenge_punctuation_player_start_fk FOREIGN KEY (player_start_id) REFERENCES public.player_start(id_fk);

ALTER TABLE
    public.player_challenge_punctuation
ADD
    CONSTRAINT player_challenge_punctuation_player_start_punctuated_fk FOREIGN KEY (player_start_punctuated_id) REFERENCES public.player_start(id_fk);

ALTER TABLE
    public.player_challenge_punctuation
ADD
    CONSTRAINT player_challenge_punctuation_player_challenge_fk FOREIGN KEY (player_challenge_id) REFERENCES public.player_challenge(id);

CREATE TABLE IF NOT EXISTS public.applicator_challenge_punctuation (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    punctuation integer not null default 0,
    player_start_punctuated_id INT4 NOT NULL,
    player_challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.applicator_challenge_punctuation
ADD
    CONSTRAINT applicator_challenge_punctuation_player_start_punctuated_fk FOREIGN KEY (player_start_punctuated_id) REFERENCES public.player_start(id_fk);

ALTER TABLE
    public.applicator_challenge_punctuation
ADD
    CONSTRAINT applicator_challenge_punctuation_player_challenge_fk FOREIGN KEY (player_challenge_id) REFERENCES public.player_challenge(id);

CREATE TABLE IF NOT EXISTS public.player_termineted_challenge (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    applicator_start_id INT4 NOT NULL,
    player_start_id INT4 NOT NULL,
    challenge_id INT4 NOT NULL
);

ALTER TABLE
    public.player_termineted_challenge
ADD
    CONSTRAINT player_termineted_challenge_applicator_start_fk FOREIGN KEY (applicator_start_id) REFERENCES public.applicator_start(id);

ALTER TABLE
    public.player_termineted_challenge
ADD
    CONSTRAINT player_termineted_challenge_player_start_fk FOREIGN KEY (player_start_id) REFERENCES public.player_start(id_fk);

ALTER TABLE
    public.player_termineted_challenge
ADD
    CONSTRAINT player_termineted_challenge_challenge_fk FOREIGN KEY (challenge_id) REFERENCES public.challenge(id);