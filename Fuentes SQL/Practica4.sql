--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      J
-- Project :      practica4.dm1
-- Author :       Jeyson
--
-- Date Created : Saturday, April 25, 2015 00:53:47
-- Target DBMS : PostgreSQL 8.0
--

-- 
-- TABLE: ASIGNACION_RUTA 
--

CREATE TABLE ASIGNACION_RUTA(
    ID_ASIGNACION   serial    NOT NULL,
    ID_RUTA        integer    NOT NULL,
    ID_BUS         integer    NOT NULL,
    FECHA          date,
    CUPO_ACTUAL    integer,
    CONSTRAINT PK7 PRIMARY KEY (ID_ASIGNACION, ID_RUTA, ID_BUS)
)
;



-- 
-- TABLE: BUS 
--

CREATE TABLE BUS(
    ID_BUS    serial    NOT NULL,
    TIPO_BUS  integer     NOT NULL,
    PLACAS    char(15)    NOT NULL,
    COSTO_KILOMETRO  decimal(25, 0)    NOT NULL,
    CONSTRAINT PK5 PRIMARY KEY (ID_BUS)
)
;



-- 
-- TABLE: CLIENTE 
--

CREATE TABLE CLIENTE(
    ID_CLIENTE   serial        NOT NULL,
    NOMBRE      char(35)       NOT NULL,
    NIT         integer,
    CONSTRAINT PK1 PRIMARY KEY (ID_CLIENTE)
)
;



-- 
-- TABLE: DESTINO 
--

CREATE TABLE DESTINO(
    ID_DESTINO   serial     NOT NULL,
    NOMBRE      char(25)    NOT NULL,
    CONSTRAINT PK3 PRIMARY KEY (ID_DESTINO)
)
;



-- 
-- TABLE: FACTURA 
--

CREATE TABLE FACTURA(
    ID_FACTURA   serial          NOT NULL,
    FECHA       date,
    TOTAL       decimal(10, 0),
    ID_CLIENTE  integer           NOT NULL,
    CONSTRAINT PK10 PRIMARY KEY (ID_FACTURA)
)
;



-- 
-- TABLE: RESERVACION 
--

CREATE TABLE RESERVACION(
    ID_RESERVACION   serial    NOT NULL,
    ID_CLIENTE      integer    NOT NULL,
    ID_BUS          integer    NOT NULL,
    CONSTRAINT PK11 PRIMARY KEY (ID_RESERVACION)
)
;



-- 
-- TABLE: RUTA 
--

CREATE TABLE RUTA(
    ID_RUTA   serial    NOT NULL,
    NOMBRE   char(25),
    CONSTRAINT PK2 PRIMARY KEY (ID_RUTA)
)
;



-- 
-- TABLE: RUTA_DESTINO 
--

CREATE TABLE RUTA_DESTINO(
    NO_TRAMO          integer           NOT NULL,
    ID_RUTA           integer           NOT NULL,
    ID_DESTINO        integer           NOT NULL,
    TIEMPO_ORIGEN     char(10),
    DISTANCIA_ORIGEN  decimal(18, 0)    NOT NULL,
    CONSTRAINT PK8 PRIMARY KEY (ID_RUTA, ID_DESTINO, NO_TRAMO)
)
;



-- 
-- TABLE: TICKET 
--

CREATE TABLE TICKET(
    ID_TICKET           serial    NOT NULL,
    HORA_SALIDA         char(10),
    HORA_LLEGADA        char(10),
    ID_RUTA             integer     NOT NULL,
    ID_RUTA_ORIGEN      integer     NOT NULL,
    ID_DESTINO_ORIGEN   integer     NOT NULL,
    ID_DESTINO          integer     NOT NULL,
    NO_TRAMO            integer     NOT NULL,
    NO_ESTACION_ORIGEN  integer     NOT NULL,
    ID_RESERVACION      integer     NOT NULL,
    ID_FACTURA          integer,
    ESTADO_TICKET       boolean,
    CONSTRAINT PK4 PRIMARY KEY (ID_TICKET)
)
;



-- 
-- TABLE: TIPO_BUS 
--

CREATE TABLE TIPO_BUS(
    TIPO_BUS         serial           NOT NULL,
    NOMBRE           char(20)          NOT NULL,
    CAPACIDAD        integer           NOT NULL,
    CONSTRAINT PK6 PRIMARY KEY (TIPO_BUS)
)
;



-- 
-- TABLE: ASIGNACION_RUTA 
--

ALTER TABLE ASIGNACION_RUTA ADD CONSTRAINT RefBUS2 
    FOREIGN KEY (ID_BUS)
    REFERENCES BUS(ID_BUS)
;

ALTER TABLE ASIGNACION_RUTA ADD CONSTRAINT RefRUTA3 
    FOREIGN KEY (ID_RUTA)
    REFERENCES RUTA(ID_RUTA)
;


-- 
-- TABLE: BUS 
--

ALTER TABLE BUS ADD CONSTRAINT RefTIPO_BUS1 
    FOREIGN KEY (TIPO_BUS)
    REFERENCES TIPO_BUS(TIPO_BUS)
;


-- 
-- TABLE: FACTURA 
--

ALTER TABLE FACTURA ADD CONSTRAINT RefCLIENTE20 
    FOREIGN KEY (ID_CLIENTE)
    REFERENCES CLIENTE(ID_CLIENTE)
;


-- 
-- TABLE: RESERVACION 
--

ALTER TABLE RESERVACION ADD CONSTRAINT RefCLIENTE18 
    FOREIGN KEY (ID_CLIENTE)
    REFERENCES CLIENTE(ID_CLIENTE)
;

ALTER TABLE RESERVACION ADD CONSTRAINT RefBUS26 
    FOREIGN KEY (ID_BUS)
    REFERENCES BUS(ID_BUS)
;


-- 
-- TABLE: RUTA_DESTINO 
--

ALTER TABLE RUTA_DESTINO ADD CONSTRAINT RefRUTA8 
    FOREIGN KEY (ID_RUTA)
    REFERENCES RUTA(ID_RUTA)
;

ALTER TABLE RUTA_DESTINO ADD CONSTRAINT RefDESTINO9 
    FOREIGN KEY (ID_DESTINO)
    REFERENCES DESTINO(ID_DESTINO)
;


-- 
-- TABLE: TICKET 
--

ALTER TABLE TICKET ADD CONSTRAINT RefRUTA_DESTINO16 
    FOREIGN KEY (ID_RUTA, ID_DESTINO, NO_TRAMO)
    REFERENCES RUTA_DESTINO(ID_RUTA, ID_DESTINO, NO_TRAMO)
;

ALTER TABLE TICKET ADD CONSTRAINT RefRUTA_DESTINO17 
    FOREIGN KEY (ID_RUTA_ORIGEN, ID_DESTINO_ORIGEN, NO_ESTACION_ORIGEN)
    REFERENCES RUTA_DESTINO(ID_RUTA, ID_DESTINO, NO_TRAMO)
;

ALTER TABLE TICKET ADD CONSTRAINT RefRESERVACION19 
    FOREIGN KEY (ID_RESERVACION)
    REFERENCES RESERVACION(ID_RESERVACION)
;

ALTER TABLE TICKET ADD CONSTRAINT RefFACTURA21 
    FOREIGN KEY (ID_FACTURA)
    REFERENCES FACTURA(ID_FACTURA)
;


