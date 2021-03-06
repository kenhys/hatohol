/*
 * Copyright (C) 2014 Project Hatohol
 *
 * This file is part of Hatohol.
 *
 * Hatohol is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Hatohol is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Hatohol. If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef ArmIncidentTracker_h
#define ArmIncidentTracker_h

#include "ArmBase.h"
#include "DBTablesConfig.h"

class ArmIncidentTracker : public ArmBase
{
public:
	ArmIncidentTracker(const std::string &name,
			   const IncidentTrackerInfo &trackerInfo);
	virtual ~ArmIncidentTracker();

	virtual void startIfNeeded(void) = 0;
	virtual bool isFetchItemsSupported(void) const override;

	static ArmIncidentTracker *create(
	  const IncidentTrackerInfo &trackerInfo);

protected:
	const IncidentTrackerInfo &getIncidentTrackerInfo(void);

private:
	struct Impl;
	std::unique_ptr<Impl> m_impl;
};

#endif // ArmIncidentTracker_h
