import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Detail.css';
import Comment from './Comment';
import { deleteEvent, getEvent, updateEvent } from '../mockAPI/mockAPI';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import DetailLocation from './DetailLocation';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

export default function Detail() {
	const nav = useNavigate();
	const iniEvtState = {
		"createdAt": "",
		"eventTime": "",
		"Location": "",
		"eventName": "",
		"comments": [],
		"id": "1"
	}

	const [eventDetail, setEventDetail] = useState(iniEvtState);
	const [image, setImage] = useState("");
	const [comments, setComments] = useState([]);
	// read event id from url
	const location = useLocation();
	const eventID = location.pathname.split("/")[2];

	function formatDate(date) {
		var d = new Date(date),
			month = d.toLocaleString('default', { month: 'short' }),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [month, day, year].join(' ');
	}
	function formatTime(date) {
		var d = new Date(date);

		var h, m;
		if (d.getHours() < 10) {
			h = d.getHours().toString();
			h = "0" + h;
		}
		else {
			h = d.getHours().toString();
		}
		if (d.getMinutes() < 10) {
			m = "0" + d.getMinutes().toString();
		}
		else {
			m = d.getMinutes().toString();
		}
		return h + ":" + m;
	}
	const handleClick = async () => {
		const text = document.getElementById("newComment").value;
		document.getElementById("newComment").value = "";
		const newComment = {
			"createdAt": new Date(),
			"pic": "/" + image,
			text,
		}
		const newComments = [newComment, ...comments];
		if (newComment["text"].includes("delete")) {
			console.log("contain delete");
			await deleteEvent(eventID);
			nav('/');
		}
		else {
			await updateEvent(eventID, { "comments": newComments });
			setComments(newComments);
			setImage("");
		}


	}

	useEffect(() => {
		async function fetchData() {
			const eventDetail_ = await getEvent(eventID);
			if (eventDetail_ !== undefined) {
				// setEventDetail(eventDetail => ({
				// 	...eventDetail,
				// 	...eventDetail_
				// }));
				setEventDetail(eventDetail_);
				setComments(eventDetail_.comments);
			}

		}
		fetchData();
	}, [])
	var time = eventDetail.eventTime;
	var loc = eventDetail.Location;
	var name = eventDetail.eventName;
	// const comments = eventDetail.comments;
	// const description = eventDetail.eventDescription;

	return (
		<div>
			<Link to='/'>
				<ArrowBackIcon />
			</Link>
			<div className='detail-container'>
				<div className='detail-left'>
					<div className='detail-details'>{"Details"}</div>
					<hr className="hr-edge-weak" />
					<div className='detail-date'>{"Time: "}</div>
					<div className='detail-title'>{formatDate(eventDetail.eventTime) + " " + formatTime(eventDetail.eventTime)}</div>

					<div className='detail-date'>{"Event Description: "}</div>
					<div className='detail-title'>{eventDetail.eventName}</div>
					<div className='detail-title'>{eventDetail.eventDescription}</div>

					<div className='detail-details'>{"Venue"}</div>
					<hr className="hr-edge-weak" />
					<DetailLocation loc={eventDetail.Location} />
					{/* <div className='detail-location'>{eventDetail.Location}</div> */}
				</div>
				<div className='detail-right'>
					<div>
						<div className='upload'>
							<FormControl id="newComment" onSubmit={handleClick}>
								<Textarea
									placeholder="Your comment here…"
									minRows={3}
									endDecorator={
										<Box type="submit"
											sx={{
												display: 'flex',
												gap: 'var(--Textarea-paddingBlock)',
												pt: 'var(--Textarea-paddingBlock)',
												borderTop: '1px solid',
												borderColor: 'divider',
												flex: 'auto',
											}}
										>
											<input
												// style={{ display: 'none' }}
												type="file"
												id="file"
												accept=".png,.jpeg,.jpg"
												onChange={(e) => setImage(e.target.files[0].name)}
											/>
											<Button sx={{ ml: 'auto' }} onClick={handleClick}>Send</Button>
										</Box>
									}
									sx={{
										minWidth: 300,
									}}
								/>

							</FormControl>
						</div>
						<div>
							<div className='detail-details'>{"Comment"}</div>
							<hr class="hr-edge-weak" />
						</div>
						{
							comments.map((comment, k) => (
								<Comment key={k} comment={comment} />
							))
						}
					</div>

				</div>
			</div>
		</div>

	)
}