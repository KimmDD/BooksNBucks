import { useState, useEffect } from "react";
import { getSchools, postRole } from "../helpers/backend_helper";
import { signOut, useFetch } from "../helpers/hooks";
import { swalLoading } from "../components/common/alert";
import swal from "sweetalert2";
import { useRouter } from "next/router";
import { notification } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { OmitProps } from "antd/lib/transfer/ListBody";

const RoleSelection = (props) => {
  const router = useRouter();
  const [role, setRole] = useState();
  const [school, setSchool] = useState();
  const [schools] = useFetch(getSchools);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const RoleChooser = ({ role, label }) => {
    return (
      <div
        onClick={() => setRole(role)}
        className="bg-primary w-full md:w-96 rounded text-center pt-1.5 mb-3"
        role="button"
      >
        <h3 className="text-white font-medium pb-1">{label}</h3>
      </div>
    );
  };
  const ParentRoleChooser = ({ label }) => {
    return (
      <div
        onClick={() => {
          handleParentSubmit();
        }}
        className="bg-primary w-full md:w-96 rounded text-center pt-1.5 mb-3"
        role="button"
      >
        <h3 className="text-white font-medium pb-1">{label}</h3>
      </div>
    );
  };

  const handleTeacherSubmit = async () => {
    swalLoading();
    let { error, msg, token } = await postRole({
      role,
      school: school?._id,
      password,
    });
    swal.close();
    if (error === false) {
      localStorage.setItem("token", token);
      await router.push("/");
    } else {
      await notification.error({ message: "Error", description: msg });
    }
  };

  const handleSelectSchool = async (school) => {
    setSchool(school);
    if (role === "student") {
      swalLoading();
      let { error, msg, token } = await postRole({
        role,
        school: school?._id,
        password,
      });
      swal.close();
      if (error === false) {
        localStorage.setItem("token", token);
        await router.push("/");
      } else {
        await notification.error({ message: "Error", description: msg });
      }
    }
  };

  const handleParentSubmit = async () => {
    swalLoading();
    let { error, msg, token } = await postRole({
      role: "parent",
      password,
    });
    swal.close();
    if (error === false) {
      localStorage.setItem("token", token);
      await router.push("/parent");
    } else {
      await notification.error({ message: "Error", description: msg });
    }
  };

  return (
    <div
      className="flex justify-center align-items-center w-screen m-0 p-0"
      style={{ minHeight: "90vh" }}
    >
      <div className="px-8 w-full md:w-auto">
        {role ? (
          <>
            {role === "teacher" && school ? (
              <>
                <div className="flex flex-column w-96">
                  <h5 className="mb-2 font-medium">
                    Enter the Teacher Password to access
                  </h5>
                  <h3 className="mb-4 text-primary">{school?.name} School</h3>
                  <div className="relative">
                    <input
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={show ? "text" : "password"}
                      style={{ height: 48, fontSize: 24 }}
                    />
                    {show ? (
                      <FiEyeOff
                        size={22}
                        onClick={() => setShow(false)}
                        role="button"
                        className="absolute right-4 top-3.5"
                      />
                    ) : (
                      <FiEye
                        size={22}
                        onClick={() => setShow(true)}
                        role="button"
                        className="absolute right-4 top-3.5"
                      />
                    )}
                  </div>

                  <button
                    onClick={handleTeacherSubmit}
                    className="my-4 btn btn-danger btn-lg rounded-0"
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h1 className="mb-4">Join a School</h1>
                {schools?.map((school, index) => (
                  <div
                    key={index}
                    role="button"
                    onClick={() => handleSelectSchool(school)}
                    className="bg-primary w-full md:w-96 rounded text-center pt-1.5 mb-3"
                  >
                    <h3 className="text-white">{school.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <h1 className="mb-4">I am a...</h1>
            <RoleChooser role="student" label="Student" />
            <RoleChooser role="teacher" label="Teacher" />
            <ParentRoleChooser role="parent" label="Parent" />
          </div>
        )}
        <button
          className="btn btn-dark w-full md:w-96 mt-4"
          onClick={() => {
            props.setIsParent(false);
            signOut(router);
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
export default RoleSelection;
