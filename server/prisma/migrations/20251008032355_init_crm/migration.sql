-- CreateTable
CREATE TABLE `roles` (
    `idroles` INTEGER NOT NULL AUTO_INCREMENT,
    `rol` VARCHAR(45) NULL,
    `descripcion` VARCHAR(100) NULL,
    `status` CHAR(1) NULL DEFAULT 'A',

    PRIMARY KEY (`idroles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `idusuarios` INTEGER NOT NULL AUTO_INCREMENT,
    `rol` INTEGER NOT NULL,
    `username` VARCHAR(45) NULL,
    `password` LONGTEXT NULL,
    `createdate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` CHAR(1) NULL DEFAULT 'A',

    INDEX `fk_rol_idx`(`rol`),
    PRIMARY KEY (`idusuarios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CATEGOR` (
    `id_cat` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `create_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` CHAR(1) NULL DEFAULT 'A',

    PRIMARY KEY (`id_cat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SUBCATEGOR` (
    `id_subc` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cat` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `create_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` CHAR(1) NULL DEFAULT 'A',

    INDEX `SUBCATEGOR_id_cat_idx`(`id_cat`),
    PRIMARY KEY (`id_subc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INGRESOS` (
    `id_in` INTEGER NOT NULL AUTO_INCREMENT,
    `id_subc` INTEGER NOT NULL,
    `id_usr` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `date_in` DATETIME(0) NOT NULL,
    `create_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `amount` DECIMAL(10, 2) NOT NULL,
    `auto` BOOLEAN NOT NULL DEFAULT false,
    `status` CHAR(1) NULL DEFAULT 'A',

    INDEX `INGRESOS_id_subc_idx`(`id_subc`),
    INDEX `INGRESOS_id_usr_idx`(`id_usr`),
    PRIMARY KEY (`id_in`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EGRESOS` (
    `id_out` INTEGER NOT NULL AUTO_INCREMENT,
    `id_subc` INTEGER NOT NULL,
    `id_usr` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `date_out` DATETIME(0) NOT NULL,
    `create_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `amount` DECIMAL(10, 2) NOT NULL,
    `auto` BOOLEAN NOT NULL DEFAULT false,
    `status` CHAR(1) NULL DEFAULT 'A',

    INDEX `EGRESOS_id_subc_idx`(`id_subc`),
    INDEX `EGRESOS_id_usr_idx`(`id_usr`),
    PRIMARY KEY (`id_out`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_rol` FOREIGN KEY (`rol`) REFERENCES `roles`(`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SUBCATEGOR` ADD CONSTRAINT `SUBCATEGOR_id_cat_fkey` FOREIGN KEY (`id_cat`) REFERENCES `CATEGOR`(`id_cat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INGRESOS` ADD CONSTRAINT `INGRESOS_id_subc_fkey` FOREIGN KEY (`id_subc`) REFERENCES `SUBCATEGOR`(`id_subc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INGRESOS` ADD CONSTRAINT `INGRESOS_id_usr_fkey` FOREIGN KEY (`id_usr`) REFERENCES `usuarios`(`idusuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EGRESOS` ADD CONSTRAINT `EGRESOS_id_subc_fkey` FOREIGN KEY (`id_subc`) REFERENCES `SUBCATEGOR`(`id_subc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EGRESOS` ADD CONSTRAINT `EGRESOS_id_usr_fkey` FOREIGN KEY (`id_usr`) REFERENCES `usuarios`(`idusuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;
