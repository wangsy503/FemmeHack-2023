import { Link, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Detail.css';
import Comment from './Comment';
import { getEvent, updateEvent } from '../mockAPI/mockAPI';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import DetailLocation from './DetailLocation';

export default function Detail() {
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
	const handleClick = async () => {
		const text = document.getElementById("newComment").value;
		const newComment = {
			"createdAt": new Date(),
			"pic": "/" + image,
			text,
		}
		console.log(newComment);
		const newComments = [newComment, ...comments];
		// console.log(newComments);
		await updateEvent(eventID, {"comments": newComments});
		setComments(newComments);
		setImage("");
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
					<hr class="hr-edge-weak" />
					<div className='detail-date'>{"Date: "}</div>
					<div className='detail-title'>{formatDate(eventDetail.eventTime)}</div>

					<div className='detail-date'>{"Event Categories: "}</div>
					<div className='detail-title'>{eventDetail.eventName}</div>
					<div className='detail-title'>{eventDetail.eventDescription}</div>

					<div className='detail-details'>{"Venue"}</div>
					<hr class="hr-edge-weak" />
					<DetailLocation loc={eventDetail.Location} />
					<div className='detail-location'>{eventDetail.Location}</div>
				</div>
				<div className='detail-right'>
					<div>
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