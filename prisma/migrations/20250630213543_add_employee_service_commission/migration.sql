-- CreateTable
CREATE TABLE "ComisionEmpleadoServicio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empleadoId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "porcentajeComision" REAL NOT NULL,
    CONSTRAINT "ComisionEmpleadoServicio_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ComisionEmpleadoServicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ComisionEmpleadoServicio_empleadoId_servicioId_key" ON "ComisionEmpleadoServicio"("empleadoId", "servicioId");
