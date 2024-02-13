import { createBrowserRouter } from "react-router-dom";
import LayoutRoot from "../layout/LayoutRoot";
import Home from "../pages/Home";
import LayoutPrivate from "../layout/LayoutPrivate";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegistroFarmacia from "../pages/RegistroFarmacia";
import Empleados from "../pages/Empleados";
import Aempleado from "../pages/Aempleado";
import Eempleado from "../pages/Eempleado";
import Cuota from "../pages/Cuota";

export const router=createBrowserRouter([
    {
        path: '/',
        element: <LayoutRoot />,
        children: [
            {
                path: '/',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/dashboard',
                element: <LayoutPrivate />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    }
                ]
            },
            {
                path:'/registro-farmacia',
                element: <LayoutPrivate />,
                children: [
                    {
                        path: '/registro-farmacia',
                        element: <RegistroFarmacia />
                    }
                ]
            },
            {
                path:'/empleados',
                element: <LayoutPrivate />,
                children: [
                    {
                        path: '/empleados',
                        element: <Empleados />
                    }
                ]
            },
            {
                path:'/alta-empleado',
                element: <LayoutPrivate />,
                children: [
                    {
                        path: '/alta-empleado',
                        element: <Aempleado />
                    }
                ]
            },
            {
                path:'/edit-empleado',
                element: <LayoutPrivate />,
                children: [
                    {
                        path: '/edit-empleado',
                        element: <Eempleado />
                    }
                ]
            },
            {
                path:'/cuota',
                element: <LayoutPrivate />,
                children: [
                    {
                        path: '/cuota',
                        element: <Cuota />
                    }
                ]
            }

        ]
    }
])