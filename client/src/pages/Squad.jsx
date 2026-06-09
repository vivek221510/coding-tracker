import React, {useEffect,useState} from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Squad() {

    const [squads,setSquads] = useState([])
    const [loading,setLoading] = useState(true)

    const fetchSquads = async () => {
        try {
            const response = await api.get("/squads/my-squads");

            setSquads(response.data.data)

        } catch(error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }

    }

    useEffect(()=> {
        fetchSquads()
    },[]); 

  return (
    <>
        <Navbar />

        <div className='min-h-screen bg-zinc-950 text-zinc-100 px-8 py-10'>

            <div className='flex justify-between items-center mb-10'>

                <div>
                    <p className='text-violet-500 text-xs tracking-[0.25em] uppercase'>Squad Management</p>

                    <h1 className='text-4xl font-bold mt-2'>
                        My Squads
                    </h1>

                    <p className='text-zinc-400 mt-3'>Manage your squads and compete with friends</p>
                </div>

                <button 
                    className='
                    bg-violet-700
                    hover:bg-violet-700
                    px-5
                    py-3
                    rounded-xl
                    transition-all
                    '
                >
                    Create Squad
                </button>

            </div>

            {loading?(
                <h2>Loading...</h2>
            ):squads.length===0?(
                <div
                    className='
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-2xl
                    p-8
                    text-center
                    '
                >
                    <h2 className='text-2xl font-semibold'>No Squads Found</h2>

                    <p className='text-zinc-400 mt-3'>
                        Create your first squads and invite friends
                    </p>
                </div>
            ):(
                <div className='grid md:grid-cols-2 gap-6'>
                    {
                        squads.map((squad)=> (
                            <div key={squad._id}
                            className='
                                bg-zinc-900
                                border
                                border-zinc-800
                                rounded-2xl
                                p-6
                                hover:border-violet-500
                                transition-all
                            '>
                                <h2 className='text-2xl font-semibold'>
                                    {squad.name}
                                </h2>

                                <p className='text-zinc-400 mt-3'>
                                    Members: {squad.members.length}
                                </p>

                                <p className='text-zinc-400'>Admins:{squad.admins.length}
                                </p>

                                <div className='mt-6'>
                                    <Link
                                        to={`/squads/${squad._id}`}
                                        className='
                                            inline-block
                                            bg-zinc-800
                                            hover:bg-zinc-700 
                                            px-4 py-2
                                            rounded-lg 
                                            transition-all
                                        '
                                    >
                                        View Squad

                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

        </div>
    </>
  )
}

export default Squad