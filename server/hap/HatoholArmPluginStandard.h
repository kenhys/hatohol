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

#ifndef HatoholArmPluginStandard_h
#define HatoholArmPluginStandard_h

#include <SmartBuffer.h>
#include "HatoholArmPluginBase.h"

class HatoholArmPluginStandard : public HatoholArmPluginBase {
public:
	HatoholArmPluginStandard(void);
	virtual ~HatoholArmPluginStandard();

protected:
	void parseReplyGetMonitoringServerInfoOnInitiated(
	       MonitoringServerInfo &serverInfo,
	       const mlpl::SmartBuffer &replyBuf);

	virtual void onInitiated(void) override;
	virtual void onReady(const MonitoringServerInfo &serverInfo);

private:
	struct Impl;
	std::unique_ptr<Impl> m_impl;
};

#endif // HatoholArmPluginStandard_h
