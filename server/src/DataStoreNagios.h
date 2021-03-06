/*
 * Copyright (C) 2013 Project Hatohol
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

#ifndef DataStoreNagios_h
#define DataStoreNagios_h

#include "ArmNagiosNDOUtils.h"
#include "DataStore.h"

class DataStoreNagios : public DataStore {
public:
	DataStoreNagios(const MonitoringServerInfo &serverInfo,
	                const bool &autoStart = true);
	virtual ~DataStoreNagios();

	virtual const MonitoringServerInfo
	  &getMonitoringServerInfo(void) const override;
	virtual const ArmStatus &getArmStatus(void) const override;
	virtual void setCopyOnDemandEnable(bool enable);
	virtual bool isFetchItemsSupported(void) override;
	virtual void startOnDemandFetchItem(Closure0 *closure) override;
private:
	struct Impl;
	std::unique_ptr<Impl> m_impl;
};

#endif // DataStoreNagios_h
